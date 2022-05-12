import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DettagliIncaricoService } from "./dettagli-incarico.service";
import { WorkTaskSummaryService } from './work-task-summary.service';


@Injectable()
export class WorkTaskSummaryResolver extends AbstractResolver{

    constructor(private workTaskSummaryService: WorkTaskSummaryService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.workTaskSummaryService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.workTaskSummaryService.reset();
        
        return super.resolve(route, state);
    }

}