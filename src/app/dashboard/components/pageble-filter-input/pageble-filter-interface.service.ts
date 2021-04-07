import { Observable } from "rxjs";
import { FilteredPageInput } from "./filter-page-input.model";

export interface PagebleFilterInterfaceService {
    findAll(label: string): Observable<FilteredPageInput>;
}