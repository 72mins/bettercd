import { useEffect } from 'react';
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';
import { useCommandStore } from '@/store/command';

const CreateStage = () => {
    const { open, setOpen } = useCommandStore();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();

                setOpen(true);
            }
        };

        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, [setOpen]);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search for nodes..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Actions">
                    <CommandItem onSelect={(val) => console.log(val)}>
                        <Calendar />
                        <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                        <Smile />
                        <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                        <Calculator />
                        <span>Calculator</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup className="mt-2" heading="Services">
                    <CommandItem>
                        <User />
                        <span>Profile</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <CreditCard />
                        <span>Billing</span>
                        <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <Settings />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};

export default CreateStage;
