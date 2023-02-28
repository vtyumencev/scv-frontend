export interface PaginatedRecordsList<T> {
    current_page: number,
    first_page_url: string,
    from: number | null,
    next_page_url: string | null,
    path: string | null,
    per_page: number | null,
    prev_page_url: number | null,
    to: number,
    data: T
}