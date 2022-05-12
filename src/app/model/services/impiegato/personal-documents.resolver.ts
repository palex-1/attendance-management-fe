import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResetableService } from "../resetable-service.model";
import { Observable, forkJoin } from "rxjs";
import { EmployeePaycheckService } from './employee-paycheck.service';
import { MyPaychecksService } from './my-paychecks.service';
import { MyPersonalDocumentService } from './my-personal-document.service';

@Injectable()
export class PersonalDocumentsResolver extends AbstractResolver {

    constructor(private myPaychecksService: MyPaychecksService, private myPersonalDocumentService: MyPersonalDocumentService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService {
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.myPaychecksService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.myPaychecksService.reset();
        this.myPersonalDocumentService.reset();

        this.getLoadingService().startLoading();

        return Observable.create(
            (observer) => { 
                let observable: Observable<any>  = forkJoin(
                    this.myPaychecksService.loadInitialInformation(route.params),
                    this.myPersonalDocumentService.loadInitialInformation(route.params)
                );
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
                )
            }
        )
    }

}