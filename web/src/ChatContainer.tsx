import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useAuth } from '@/lib/useAuth.tsx';
import { ws } from '@/lib/cloudflare.ts';


type ChatType = {
  id: number;
  body: string;
  author: string;
  created_at: string;
  updated_at: string;
};

export default function ChatContainer() {
  const auth = useAuth();
  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_CF_CHAT_URL)
      .then((res) => res.json())
      .then((json) => setChats(json));
  }, []);

  useEffect(() => {
    const onMessage = (ev: MessageEvent<string>) => {
      const chat = JSON.parse(ev.data);
      setChats((prev) => [...prev, chat]);
    }
    ws.addEventListener('message', onMessage);
    return () => ws.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className='flex-1 flex flex-col-reverse p-2 overflow-y-auto'>
      <div className='flex flex-col gap-2'>
        {chats.map((chat) => {
          const isMine = chat.author === auth.ip;
          return (
            <div className={clsx(isMine && 'flex flex-col items-end')} key={chat.id}>
              <p className='text-sm text-muted-foreground'>{chat.author}</p>
              <p className={clsx('p-2 border rounded-lg w-fit', isMine && 'bg-primary text-primary-foreground')}>{chat.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
