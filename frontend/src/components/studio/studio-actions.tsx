import { Save, Settings } from 'lucide-react';

import { Button } from '../ui/button';
import { usePanelStore } from '@/store/panel';
import { cn } from '@/lib/utils';

const saveCount: number = 0;

const StudioActions = () => {
    const panelOpen = usePanelStore((state) => state.panelOpen);

    return (
        <div className={cn('absolute top-32 z-30 flex gap-4 transition-all duration-300 ease-in-out',
            panelOpen ? 'right-[49rem]' : 'right-4')}>
            <Button disabled={saveCount === 0} size="sm">
                <Save />
                {`Save changes ${saveCount === 0 ? '' : `(${saveCount})`}`}
            </Button>
            <Button variant="secondary" size="sm">
                <Settings />
                Pipeline settings
            </Button>
        </div>
    );
};

export default StudioActions;
