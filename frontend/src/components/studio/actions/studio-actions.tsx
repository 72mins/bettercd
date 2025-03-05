import { useParams } from 'react-router';

import { GitBranchPlus, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { usePanelStore } from '@/store/panel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CreateStage from './stage/create-stage';
import { useCommandStore } from '@/store/command';
import { useChangesStore } from '@/store/changes';
import { useMassStageUpdate } from '@/services/pipelines/changes';

const StudioActions = () => {
    const { pipelineID } = useParams();

    const panelOpen = usePanelStore((state) => state.panelOpen);
    const openCommand = useCommandStore((state) => state.openCommand);

    const { changeCount, changes, resetChanges } = useChangesStore();

    const { mutate, isPending } = useMassStageUpdate();

    const handleSave = () => {
        const submitData = {
            pipelineID: pipelineID ? +pipelineID : 0,
            params: JSON.stringify(changes),
        };

        mutate(submitData, {
            onSuccess: (res) => {
                toast.success(`Updated ${res.updated_count === 1 ? '1 stage' : `${res.updated_count} stages`}`);

                resetChanges();
            },
        });
    };

    return (
        <div
            className={cn(
                'absolute top-32 right-4 z-30 flex gap-4 transition-all duration-300 ease-in-out',
                panelOpen ? 'opacity-0 pointer-events-none duration-100' : 'opacity-100'
            )}
        >
            <Button loading={isPending} disabled={changeCount === 0} size="sm" onClick={handleSave}>
                <Save />
                {`Save changes ${changeCount === 0 ? '' : `(${changeCount})`}`}
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
