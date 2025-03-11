import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowUp } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAuth } from './lib/useAuth';
import { useEffect } from 'react';

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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-2'>
        <FormField control={form.control} name='body' render={({ field }) => (
          <FormItem className='flex-1'>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )} />
        <Button disabled={!user || !formState.isValid} type='submit' size='icon'>
          <ArrowUp />
        </Button>
      </form>
    </Form>
  );
}
