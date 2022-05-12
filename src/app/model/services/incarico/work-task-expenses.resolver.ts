import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { WorkTaskExpensesService } from "./work-task-expenses.service";


@Injectable()
export class WorkTaskExpensesResolver extends AbstractResolver{

    constructor(private workTaskExpensesService: WorkTaskExpensesService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.workTaskExpensesService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.workTaskExpensesService.reset();
        
        return super.resolve(route, state);
    }

}