import { useQueryState, parseAsInteger } from 'nuqs';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
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

const paginationRange = (currentPage: number, totalPages: number): (number | '...')[] => {
    const totalPageNumbers = 1 * 2 + 3; // Current page + siblings + start + end

    if (totalPageNumbers >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const leftRange = Array.from({ length: 3 + 2 * 1 }, (_, i) => i + 1);

        return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        const rightRangeLength = 3 + 2 * 1;
        const rightRange = Array.from({ length: rightRangeLength }, (_, i) => totalPages - rightRangeLength + i + 1);

        return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const middleRange = Array.from({ length: 1 + 2 * 1 }, (_, i) => leftSiblingIndex + i);

        return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
};

const PagePagination = ({ count, current_page, page_size }: PaginationProps) => {
    const [, setPage] = useQueryState(
        'page',
        parseAsInteger.withDefault(current_page).withOptions({ history: 'replace' })
    );

    const pageCount = Math.ceil(count / page_size);

    const handlePageChange = (page: number) => {
        if (page <= 0 || page > pageCount || page === current_page) {
            return;
        }

        setPage(page);
    };

    const range = paginationRange(current_page, pageCount);

    if (pageCount <= 1) {
        return null;
    }

    return (
        <Pagination className="w-fit float-right py-2">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(current_page - 1)} />
                </PaginationItem>
                {range.map((page, idx) => {
                    if (page === '...') {
                        return (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink isActive={current_page === page} onClick={() => handlePageChange(page)}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(current_page + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PagePagination;
