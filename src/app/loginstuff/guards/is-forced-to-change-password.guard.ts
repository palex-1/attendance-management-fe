import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from "@angular/router";
import { AuthService } from "src/app/model/services/auth/auth.service";


@Injectable()
export class IsForcedToChangePasswordGuard implements CanActivate{
    

    constructor(private authService: AuthService, private router: Router){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        if(this.authService.authenticated){
            this.router.navigateByUrl("/dashboard");
            return false;
        }
        if(this.authService.mustResetPassword){
            return true;
        }
        this.router.navigateByUrl("/login");
        return false;
    }


}