import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateStage } from '@/services/pipelines/stages';
import { toast } from 'sonner';
import { useParams } from 'react-router';

const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(100, { message: 'Name is too long' }),
    description: z.string().max(255, { message: 'Description is too long' }),
    node_type: z.string(),
    pipeline: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

const FunctionForm = ({ closeDialog }: { closeDialog: () => void }) => {
    const { pipelineID } = useParams();

    const { mutate, isPending } = useCreateStage();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            node_type: 'CUSTOM',
            pipeline: pipelineID ? +pipelineID : 0,
        },
    });

    const onSubmit = async (data: FormValues) => {
        mutate(data, {
            onSuccess: () => {
                toast.success('Custom function created');

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
                <Button loading={isPending} type="submit">
                    Create function
                </Button>
            </form>
        </Form>
    );
};

export default FunctionForm;
