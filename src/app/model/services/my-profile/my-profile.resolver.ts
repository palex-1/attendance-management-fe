import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { MyProfileService } from './my-profile.service';
import { LoadingService } from "src/app/dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";

@Injectable()
export class MyProfileResolver extends AbstractResolver{

    constructor(private myProfileService: MyProfileService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.myProfileService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        //this.myProfileService.reset();
        return super.resolve(route, state);
    }

}