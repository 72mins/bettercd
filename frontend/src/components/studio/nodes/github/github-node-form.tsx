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
import GithubDark from '@/img/github-dark.svg';
import GithubLight from '@/img/github-light.svg';
import { useTheme } from '@/components/theme/theme-provider';
import { Params, useChangesStore } from '@/store/changes';

const formSchema = z.object({
    repo_id: z.string().nonempty({ message: 'Repository ID is required' }),
    repo_branch: z.string().nonempty({ message: 'Repository branch is required' }),
});

type FormValues = z.infer<typeof formSchema>;

const repos = [
    { value: '123', label: 'ghostty' },
    { value: '124', label: 'bettercd' },
];

const branches = [
    { value: 'master', label: 'master' },
    { value: 'dev', label: 'dev' },
];

const GithubNodeForm = ({ stageID, params }: { stageID: string; params: Params }) => {
    const [open, setOpen] = useState<{ repo: boolean; branch: boolean }>({ repo: false, branch: false });

    const { addChange } = useChangesStore();
    const { theme } = useTheme();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            repo_id: params?.repo_id || '',
            repo_branch: params?.repo_branch || '',
        },
    });

    return (
        <Form {...form}>
            <form className="w-full grid gap-4">
                <FormField
                    control={form.control}
                    name="repo_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Repository</FormLabel>
                            <Popover open={open.repo} onOpenChange={(newOpen) => setOpen({ ...open, repo: newOpen })}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            size="sm"
                                            className={cn('justify-between', !field.value && 'text-muted-foreground')}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex w-full gap-2 items-center">
                                                    {field?.value && (
                                                        <img
                                                            className="size-4"
                                                            src={theme === 'light' ? GithubDark : GithubLight}
                                                            alt="Github Logo"
                                                        />
                                                    )}
                                                    {field.value
                                                        ? repos.find((repo) => repo.value === field.value)?.label
                                                        : 'Select repository'}
                                                </div>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </div>
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

                                                            addChange({
                                                                stage_id: +stageID,
                                                                params: { repo_id: repo.value },
                                                            });
                                                            setOpen({ ...open, repo: false });
                                                        }}
                                                    >
                                                        <img
                                                            className="size-4"
                                                            src={theme === 'light' ? GithubDark : GithubLight}
                                                            alt="Github Logo"
                                                        />
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
                <FormField
                    control={form.control}
                    name="repo_branch"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Branch</FormLabel>
                            <Popover
                                open={open.branch}
                                onOpenChange={(newOpen) => setOpen({ ...open, branch: newOpen })}
                            >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            size="sm"
                                            className={cn('justify-between', !field.value && 'text-muted-foreground')}
                                        >
                                            {field.value
                                                ? branches.find((branch) => branch.value === field.value)?.label
                                                : 'Select branch'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                    <Command>
                                        <CommandInput placeholder="Search branches..." />
                                        <CommandList>
                                            <CommandEmpty>No branches found.</CommandEmpty>
                                            <CommandGroup>
                                                {branches.map((branch) => (
                                                    <CommandItem
                                                        className={cn(branch.value === field.value && 'font-medium')}
                                                        value={branch.label}
                                                        key={branch.value}
                                                        onSelect={() => {
                                                            form.setValue('repo_branch', branch.value);

                                                            addChange({
                                                                stage_id: +stageID,
                                                                params: { repo_branch: branch.value },
                                                            });

                                                            setOpen({ ...open, branch: false });
                                                        }}
                                                    >
                                                        {branch.label}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                branch.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
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
