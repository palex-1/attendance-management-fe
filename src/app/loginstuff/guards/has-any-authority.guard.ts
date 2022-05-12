import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from "@angular/router";
import { AuthService } from "src/app/model/services/auth/auth.service";
import { AuthoritiesService } from "src/app/model/services/auth/authorities.service";
import { Observable } from "rxjs";



@Injectable()
export class HasAnyAuthorityGuard implements CanActivate {

    constructor(private authService: AuthService,
                        private authoritiesService: AuthoritiesService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
        let authParams = route.data["auth"];

        if(!this.authService.authenticated){
            return false;
        }
        if(authParams!=null){
            return this.authoritiesService.hasAuthority(authParams.authority);
        }

        return this.authService.authenticated;
    }
    
}