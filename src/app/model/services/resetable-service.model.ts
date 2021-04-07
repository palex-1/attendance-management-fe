import { Observable } from "rxjs";
import { Params } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

export interface ResetableService{
    reset(): void;
    areDataLoaded(): boolean;
    loadInitialInformation(routeParams?: Params): Observable<any>;
    onResolveFailure(error: HttpErrorResponse): void;
}