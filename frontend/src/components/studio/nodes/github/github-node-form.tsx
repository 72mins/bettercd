import { useState } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const formSchema = z.object({
    repo_id: z.string().nonempty({ message: 'Repository ID is required' }),
    repo_branch: z.string().nonempty({ message: 'Repository branch is required' }),
});

type FormValues = z.infer<typeof formSchema>;

const repos = [
    { value: '123', label: 'ghostty' },
    { value: '124', label: 'bettercd' },
];

const GithubNodeForm = () => {
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            repo_id: '',
            repo_branch: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="repo_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Repository</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn('justify-between', !field.value && 'text-muted-foreground')}
                                        >
                                            {field.value
                                                ? repos.find((repo) => repo.value === field.value)?.label
                                                : 'Select repository'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                    <Command>
                                        <CommandInput placeholder="Search repositories..." />
                                        <CommandList>
                                            <CommandEmpty>No repositories found.</CommandEmpty>
                                            <CommandGroup>
                                                {repos.map((repo) => (
                                                    <CommandItem
                                                        className={cn(repo.value === field.value && 'font-medium')}
                                                        value={repo.label}
                                                        key={repo.value}
                                                        onSelect={() => {
                                                            form.setValue('repo_id', repo.value);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        {repo.label}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                repo.value === field.value ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default GithubNodeForm;
