import { useEffect, useState } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { clsx } from 'clsx';
import { supabase } from '@/lib/supabase.ts';
import { useAuth } from '@/lib/useAuth.tsx';


type ChatType = {
  id: number;
  body: string;
  author: string;
  created_at: string;
  updated_at: string;
};

export default function ChatContainer() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('chat').select();
      setChats(data ?? []);
      console.log(data);
    })();
  }, []);

  useEffect(() => {
    const changes = supabase.channel('chat-db-changes').on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'chat' },
      (payload: RealtimePostgresChangesPayload<ChatType>) => {
        console.log(payload);
        if (payload.eventType !== 'INSERT') throw new Error('Not Insert Event!');
        setChats((prev) => [...prev, payload.new]);
      },
    ).subscribe();

    return () => {
      changes.unsubscribe();
    }
  }, []);

  return (
    <div className='flex-1 flex flex-col-reverse p-2 overflow-y-auto'>
      <div className='flex flex-col gap-2'>
        {chats.map((chat) => {
          const isMine = chat.author === user?.id;
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
