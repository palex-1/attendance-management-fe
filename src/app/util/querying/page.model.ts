export class Page<T> {
    public totalElements ?: number;
    public totalPages ?: number;
    public sort ?: Sort;
    public last ?: boolean;
    public first ?: boolean;
    public pageable ?: Pageable;
    public numberOfElements ?: number;
    public size ?: number;
    public content ?: T[];
}

export class Sort {
    public sorted ?: boolean;
    public unsorted ?: boolean;
    public empty ?: boolean;
}

export class Pageable {
    public page ?: number;
    public size ?: number;
    public sort ?: string[];
}