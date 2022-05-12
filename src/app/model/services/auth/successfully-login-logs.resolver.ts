import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "src/app/dialogs/loading/loading.service";
import { SuccessfullyLoginLogsService } from "./successfully-login-logs.service";

@Injectable()
export class SuccessfullyLoginLogsResolver extends AbstractResolver{


    constructor(private succLoginLogsSrv: SuccessfullyLoginLogsService,
                    private loader: LoadingService){
            super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.succLoginLogsSrv;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.succLoginLogsSrv.reset();
        
        return super.resolve(route, state);
    }
    
}