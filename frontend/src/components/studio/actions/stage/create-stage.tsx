import { useState } from 'react';
import { useParams } from 'react-router';

import { SquareTerminal } from 'lucide-react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { useCommandStore } from '@/store/command';
import { useTheme } from '@/components/theme/theme-provider';

import GithubDark from '@/img/github-dark.svg';
import GithubLight from '@/img/github-light.svg';
import Gitlab from '@/img/gitlab.svg';
import Redis from '@/img/redis.svg';
import Postgres from '@/img/postgresql.svg';
import StageStep from './stage-step';
import { useCreateGithubNode } from '@/services/pipelines/stages';

const CreateStage = () => {
    const { pipelineID } = useParams();

    const [stepOpen, setStepOpen] = useState<boolean>(false);
    const openStep = () => setStepOpen(true);

    const { open, setOpen, closeCommand } = useCommandStore();
    const { theme } = useTheme();

    const { mutate: createGithubNode } = useCreateGithubNode();

    const handleClick = (val: string) => {
        switch (val) {
            case 'custom':
                closeCommand();
                openStep();
                break;
            case 'github':
                createGithubNode({ pipeline: pipelineID ? +pipelineID : 0 });
                closeCommand();
                break;
        }
    };

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search for nodes..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Version Control">
                        <CommandItem onSelect={() => handleClick('github')}>
                            <img
                                className="size-4"
                                src={theme === 'light' ? GithubDark : GithubLight}
                                alt="Github Logo"
                            />
                            GitHub
                        </CommandItem>
                        <CommandItem>
                            <img className="size-4" src={Gitlab} alt="Gitlab Logo" />
                            GitLab
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup className="mt-2" heading="Actions">
                        <CommandItem onSelect={() => handleClick('custom')}>
                            <SquareTerminal />
                            Custom Function
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup className="mt-2" heading="Services">
                        <CommandItem>
                            <img className="size-4" src={Postgres} alt="Postgres Logo" />
                            PostgreSQL
                        </CommandItem>
                        <CommandItem>
                            <img className="size-4" src={Redis} alt="Redis Logo" />
                            Redis
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            <StageStep open={stepOpen} setOpen={setStepOpen} />
        </>
    );
};

export default CreateStage;
