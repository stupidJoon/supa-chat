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
  const auth = useAuth();
  return <Button variant='outline'>{auth.ip}</Button>
}
