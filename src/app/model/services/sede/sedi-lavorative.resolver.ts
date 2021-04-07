import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { SediLavorativeService } from "./sedi-lavorative.service";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResetableService } from "../resetable-service.model";
import { Observable } from "rxjs";

@Injectable()
export class SediLavorativeResolver extends AbstractResolver{

    constructor(private sediSrv: SediLavorativeService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.sediSrv;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.sediSrv.reset();
        
        return super.resolve(route, state);
    }

}