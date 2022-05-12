import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DettagliIncaricoService } from "./dettagli-incarico.service";


@Injectable()
export class DettagliIncaricoResolver extends AbstractResolver{

    constructor(private dettagliIncaricoSrv: DettagliIncaricoService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.dettagliIncaricoSrv;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.dettagliIncaricoSrv.reset();
        
        return super.resolve(route, state);
    }

}