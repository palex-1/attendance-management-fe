import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { of } from 'rxjs';
import { LoadingService } from "../../dialogs/loading/loading.service";
import { ResetableService } from "./resetable-service.model";
import { HttpErrorResponse } from "@angular/common/http";

export abstract class AbstractResolver {

    abstract getResetableService(): ResetableService;
    abstract getLoadingService(): LoadingService;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        if(!this.getResetableService().areDataLoaded()){
            this.getLoadingService().startLoading();
            
            return Observable.create(
                (observer) => {
                    let observable: Observable<any>  = this.getResetableService().loadInitialInformation(route.params);
                    if(observable==null){
                        observer.next(true);
                        observer.complete(); 
                        return;
                    }
                    observable.subscribe(
                        (successful) => {
                            if(successful){
                                observer.next(true);
                                observer.complete(); 
                            }else{
                                this.getLoadingService().endLoading()
                                observer.next(false);
                            }
                        },
                        (error: HttpErrorResponse) =>{
                            this.getResetableService().onResolveFailure(error);
                            observer.next(false);
                            throw error;
                        }
                    );
                }
            );
        }
        return of(true);
    }
    

    
}