import { useEffect } from 'react';

import { toast } from 'sonner';

import CodeEditor from './editor';
import { SlidingPanel } from '@/components/ui/sliding-panel';
import { Button } from '@/components/ui/button';
import { useGetScriptValue, useUpdateStage } from '@/services/pipelines/stages';
import { usePanelStore } from '@/store/panel';

const EditorPanel = () => {
    const { panel, panelValue, setPanelValue, panelOpen, closePanel } = usePanelStore();

    const { data: scriptData, isPending: scriptPending } = useGetScriptValue(+panel, panelValue);

    const { mutate, isPending } = useUpdateStage();

    const saveChanges = () => {
        mutate(
            { id: panel, script_value: panelValue },
            { onSuccess: () => toast.success('Script updated successfully') }
        );
    };

    useEffect(() => {
        if (scriptData && !scriptPending) {
            setPanelValue(scriptData.script_value);
        }
    }, [scriptData, scriptPending, setPanelValue]);

    return (
        <SlidingPanel size="full" open={panelOpen} onClose={closePanel}>
            <div className="px-4 w-full">
                <CodeEditor value={panelValue} setValue={setPanelValue} />
                <div className="flex justify-end">
                    <Button variant="secondary" className="mt-4 min-w-36 mr-4" onClick={closePanel}>
                        Cancel
                    </Button>
                    <Button loading={isPending} onClick={saveChanges} className="mt-4 min-w-36" variant="default">
                        Save Changes
                    </Button>
                </div>
            </div>
        </SlidingPanel>
    );
};

export default EditorPanel;
