import { GitBranchPlus, Save, Settings } from 'lucide-react';

import { usePanelStore } from '@/store/panel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CreateStage from './stage/create-stage';
import { useCommandStore } from '@/store/command';

const saveCount: number = 0;

const StudioActions = () => {
    const panelOpen = usePanelStore((state) => state.panelOpen);
    const openCommand = useCommandStore((state) => state.openCommand);

    return (
        <div
            className={cn(
                'absolute top-32 right-4 z-30 flex gap-4 transition-all duration-300 ease-in-out',
                panelOpen ? 'opacity-0 pointer-events-none duration-100' : 'opacity-100'
            )}
        >
            <Button disabled={saveCount === 0} size="sm">
                <Save />
                {`Save changes ${saveCount === 0 ? '' : `(${saveCount})`}`}
            </Button>
            <Button size="sm" onClick={openCommand}>
                <GitBranchPlus />
                Create stage
            </Button>
            <Button variant="secondary" size="sm">
                <Settings />
                Pipeline settings
            </Button>
            <CreateStage />
        </div>
    );
};

export default StudioActions;
