import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUp } from 'lucide-react';
import { supabase } from '@/lib/supabase.ts';
import { useAuth } from '@/lib/useAuth.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';

const formSchema = z.object({
  body: z.string().nonempty(),
});

export default function ChatForm() {
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: '',
    },
  });
  const { formState, reset } = form;

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await supabase.from('chat').insert({ body: values.body });
    console.log(res);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-2'>
        <FormField name={'body'} control={form.control} render={({ field }) => (
            <FormItem className='flex-1'>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
        )} />
        <Button type='submit' size='icon' disabled={!user || !formState.isValid}>
          <ArrowUp />
        </Button>
      </form>
    </Form>
  );
}
