import { UserProfileInfoService } from "./user-profile-info.service";
import { AbstractResolver } from "../abstract.resolver";
import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { LoadingService } from "src/app/dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";



@Injectable()
export class UserProfileInfoResolver extends AbstractResolver {

    constructor(private userProfileInfoSrv: UserProfileInfoService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.userProfileInfoSrv;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.userProfileInfoSrv.reset(); //reset every time
        return super.resolve(route, state);
    }

}