export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface Pagination {
    count: number;
    current_page: number;
    page_size: number;
}
