import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { TurnstileService } from './turnstile.service';


@Injectable()
export class TurnstileResolver extends AbstractResolver{

    constructor(private turnstileSrv: TurnstileService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.turnstileSrv;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.turnstileSrv.reset();

        return super.resolve(route, state);
    }

}