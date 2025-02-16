import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFetchPipelines } from '@/services/pipelines/pipelines';
import { Ellipsis, Trash2, Workflow } from 'lucide-react';
import { Link } from 'react-router';

const PipelineTable = () => {
    const { data } = useFetchPipelines();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.results?.map((pipeline) => {
                    const { id, name, description } = pipeline;

                    return (
                        <TableRow key={id}>
                            <TableCell>{name}</TableCell>
                            <TableCell>{description}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Ellipsis />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-42">
                                        <DropdownMenuItem>
                                            <Workflow />
                                            <Link to={`${id}/studio`}>Pipeline Studio</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
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
    );
};

export default PipelineTable;
