import '@/App.css';
import ChatForm from './ChatForm';
import ChatContainer from './ChatContainer';
import Header from './Header';
import { AuthProvider } from './lib/useAuth';

export default function App() {
  return (
    <div className='flex h-svh w-full justify-center items-center p-4'>
      <div className='w-full max-w-sm h-full max-h-[50rem] border rounded-lg p-6 flex flex-col gap-4'>
        <AuthProvider>
          <Header />
          <ChatContainer />
          <ChatForm />
        </AuthProvider>
      </div>
    </div>
  );
}

