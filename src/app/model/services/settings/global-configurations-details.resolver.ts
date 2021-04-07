import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResetableService } from "../resetable-service.model";
import { Observable } from "rxjs";
import { GlobalConfigurationDetailsService } from './global-configurations-details.service';

@Injectable()
export class GlobalConfigurationDetailsResolver extends AbstractResolver {

    constructor(private globalConfigurationDetailsService: GlobalConfigurationDetailsService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService {
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.globalConfigurationDetailsService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.globalConfigurationDetailsService.reset();

        return super.resolve(route, state)
    }

}