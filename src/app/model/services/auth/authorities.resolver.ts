import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "src/app/dialogs/loading/loading.service";
import { AuthoritiesService } from "./authorities.service";

@Injectable()
export class AuthoritiesResolver extends AbstractResolver{


    constructor(private authService: AuthoritiesService,
                    private loader: LoadingService){
            super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.authService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.authService.reset();
        return super.resolve(route, state);
    }
    
}