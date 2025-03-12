import { useQueryState, parseAsInteger } from 'nuqs';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination';

interface PaginationProps {
    count: number;
    current_page: number;
    page_size: number;
}

const PagePagination = ({ count, current_page, page_size }: PaginationProps) => {
    const [_, setPage] = useQueryState('page', parseAsInteger.withDefault(current_page));

    const handlePageChange = (page: number) => {
        if (page <= 0 || page > Math.ceil(count / page_size)) {
            return;
        }

        setPage(page);
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(current_page - 1)} />
                </PaginationItem>
                {Array.from({ length: Math.ceil(count / page_size) }, (_, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink isActive={current_page === i + 1} onClick={() => setPage(i + 1)}>
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(current_page + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PagePagination;
