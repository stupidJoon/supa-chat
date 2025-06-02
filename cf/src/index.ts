import { DurableObject } from 'cloudflare:workers';

export class ChatDurableObject extends DurableObject<Env> {
	sql: SqlStorage;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.sql = ctx.storage.sql;

		this.sql.exec(`
			CREATE TABLE IF NOT EXISTS chat (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				body TEXT NOT NULL,
				author TEXT NOT NULL,
				created_at DEFAULT CURRENT_TIMESTAMP
			);
		`);
	}

	async getChats() {
		const chats = this.sql.exec('SELECT * FROM chat').toArray();
		return chats;
	}

	async fetch(request: Request): Promise<Response> {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		this.ctx.acceptWebSocket(server);

		const ip = request.headers.get('CF-Connecting-IP'); // npm run dev 환경에선 ip 안보임
		server.serializeAttachment({ ip });

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		if (typeof message !== 'string') throw new Error('String Expected');
		const { ip } = ws.deserializeAttachment();
		const { body } = JSON.parse(message);

		this.sql.exec('INSERT INTO chat (body, author) VALUES (?, ?)', body, ip);
		const { id } = this.sql.exec('SELECT last_insert_rowid() as id').one();

		const connections = this.ctx.getWebSockets()
			.filter((connection) => connection.readyState === 1)
			.map((connection) => ({ connection, ...connection.deserializeAttachment() }));
		connections.forEach(({ connection }) => connection.send(JSON.stringify({ id, author: ip, body })));
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		ws.close(code, 'Durable Object is closing WebSocket');
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const id: DurableObjectId = env.CHAT_DURABLE_OBJECT.idFromName('chat');
		const stub = env.CHAT_DURABLE_OBJECT.get(id);
		console.log(url.pathname);
		if (url.pathname === '/ws') {
			return stub.fetch(request);
		}
		else if (url.pathname === '/chat') {
			const chats = await stub.getChats();
			return new Response(JSON.stringify(chats), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			});
		}
		else {
			return new Response("404 Not Found", { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
