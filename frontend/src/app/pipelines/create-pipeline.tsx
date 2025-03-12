import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePipeline } from '@/services/pipelines/pipelines';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(100, { message: 'Name is too long' }),
    description: z.string().max(255, { message: 'Description is too long' }),
});

type FormValues = z.infer<typeof formSchema>;

const PipelineCreate = ({ closeDialog }: { closeDialog: () => void }) => {
    const { mutate, isPending } = useCreatePipeline();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        mutate(data, {
            onSuccess: () => {
                toast.success('Pipeline created');

                closeDialog();
            },
        });
    };

    return (
        <Form {...form}>
            <form className="grid mt-4 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea className="h-36" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" loading={isPending}>
                    Create Pipeline
                </Button>
            </form>
        </Form>
    );
};

export default PipelineCreate;
