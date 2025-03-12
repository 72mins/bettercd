import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { EllipsisVertical, GitCommitHorizontal, Trash2, Workflow } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDeletePipeline, useFetchPipelines } from '@/services/pipelines/pipelines';
import { Input } from '@/components/ui/input';
import StatusDot from '@/components/base/status-dot';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import EmptyState from '@/components/base/empty-state';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PipelineCreate from './create-pipeline';

const PipelineTable = () => {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const navigateToStudio = (id: number) => navigate(`${id}/studio`);

    const { data } = useFetchPipelines();

    const { mutate } = useDeletePipeline();

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();

        mutate(id, {
            onSuccess: () => {
                toast.success('Pipeline deleted successfully');
            },
        });
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4 gap-4">
                <Input className="h-10" placeholder="Search pipelines" />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Pipeline</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Pipeline</DialogTitle>
                        </DialogHeader>
                        <PipelineCreate closeDialog={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                {data?.results && data?.results?.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Commit</TableHead>
                                <TableHead className="text-center">Duration</TableHead>
                                <TableHead className="text-center">Last Run</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.results?.map((pipeline) => {
                                const { id, name, description } = pipeline;

                                return (
                                    <TableRow key={id} className="cursor-pointer" onClick={() => navigateToStudio(id)}>
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <StatusDot status="success" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        The pipeline's last run was successful
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>{name}</TableCell>
                                        <TableCell className="max-w-80 truncate text-muted-foreground">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>{description}</TooltipTrigger>
                                                    <TooltipContent className="max-w-96">{description}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell className="flex h-14 justify-center items-center gap-1">
                                            <GitCommitHorizontal className="size-4 text-muted-foreground" />
                                            <a
                                                onClick={(e) => e.stopPropagation()}
                                                href="https://github.com/72mins/bettercd-waitlist/commit/7e8f1db0cdd55ae5e58f4a6459f756971422cee6"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                7e8f1db
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-center">14m 32s</TableCell>
                                        <TableCell className="text-center">48m ago</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <EllipsisVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-42">
                                                    <DropdownMenuItem>
                                                        <Workflow />
                                                        <Link to={`${id}/studio`}>Pipeline Studio</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-500 focus:text-red-500"
                                                        onClick={(e) => handleDelete(e, id)}
                                                    >
                                                        <Trash2 className="text-red-500" />
                                                        Delete Pipeline
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <EmptyState
                        title="No pipelines available"
                        description="There are no pipelines to display at the moment."
                        icon={Workflow}
                    />
                )}
            </div>
        </>
    );
};

export default PipelineTable;
