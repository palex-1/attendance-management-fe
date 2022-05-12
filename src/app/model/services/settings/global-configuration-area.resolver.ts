import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResetableService } from "../resetable-service.model";
import { Observable, forkJoin } from "rxjs";
import { UserLevelsService } from './user-levels.service';
import { GlobalConfigurationAreaService } from './global-configuration-area.service';

@Injectable()
export class GlobalConfigurationAreaResolver extends AbstractResolver {

    constructor(private globalConfigurationAreaService: GlobalConfigurationAreaService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService {
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.globalConfigurationAreaService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.globalConfigurationAreaService.reset();

        return super.resolve(route, state)
    }

}