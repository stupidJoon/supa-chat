import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ws } from '@/lib/cloudflare.ts';
import { useAuth } from '@/lib/useAuth.tsx';

const formSchema = z.object({
  body: z.string().nonempty(),
});

export default function ChatForm() {
  const auth = useAuth();

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
    ws.send(JSON.stringify({ body: values.body }));
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
        <Button type='submit' size='icon' disabled={!auth.ip || !formState.isValid || formState.isSubmitting}>
          <ArrowUp />
        </Button>
      </form>
    </Form>
  );
}
