import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { TaskCompletionLocksService } from './task-completion-locks.service';


@Injectable()
export class TaskCompletionLocksResolver extends AbstractResolver{

    constructor(private taskCompletionLocksService: TaskCompletionLocksService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.taskCompletionLocksService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.taskCompletionLocksService.reset();

        return super.resolve(route, state);
    }

}