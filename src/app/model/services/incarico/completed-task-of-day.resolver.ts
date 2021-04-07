import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CompletedTaskOfDayService } from './completed-task-of-day.service';


@Injectable()
export class CompletedTaskOfDayResolver extends AbstractResolver{

    constructor(private completedTaskOfDayService: CompletedTaskOfDayService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.completedTaskOfDayService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.completedTaskOfDayService.reset();

        return super.resolve(route, state);
    }

}