import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResetableService } from "../resetable-service.model";
import { Observable, forkJoin } from "rxjs";
import { UserLevelsService } from './user-levels.service';

@Injectable()
export class UserLevelsResolver extends AbstractResolver {

    constructor(private userLevelsService: UserLevelsService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService {
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.userLevelsService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.userLevelsService.reset();

        return super.resolve(route, state)
    }

}