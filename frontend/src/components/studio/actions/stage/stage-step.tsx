import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import FunctionForm from './function-form';

const StageStep = ({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Custom Function</DialogTitle>
                <FunctionForm closeDialog={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default StageStep;
