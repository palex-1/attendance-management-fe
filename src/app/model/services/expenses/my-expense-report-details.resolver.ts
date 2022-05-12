import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { MyExpenseReportsDetailsService } from './my-expense-report-details.service';


@Injectable()
export class MyExpenseReportsDetailsResolver extends AbstractResolver{

    constructor(private reportsService: MyExpenseReportsDetailsService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.reportsService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.reportsService.reset();

        return super.resolve(route, state);
    }

}