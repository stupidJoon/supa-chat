import { supabase } from '@/lib/supabase.ts';
import { useAuth } from '@/lib/useAuth.tsx';
import { ModeToggle } from '@/components/ui/mode-toggle.tsx';
import { Button } from '@/components/ui/button.tsx';

export default function Header() {
  return (
    <header className='flex justify-between'>
      <h1 className='text-2xl font-bold'>Supa-Chat</h1>
      <div className='flex gap-2'>
        <Auth />
        <ModeToggle />
      </div>
    </header>
  );
}

function Auth() {
  const { user, setUser } = useAuth();

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    if (!data.user) throw new Error('user is null');
    setUser(data.user);
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  if (user === undefined) return null;
  else if (user === null)
    return (
      <Button variant='outline' onClick={signIn}>로그인</Button>
    );
  else
    return (
      <Button variant='outline' onClick={signOut}>로그아웃</Button>
    );
}
