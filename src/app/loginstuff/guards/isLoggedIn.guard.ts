import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from "@angular/router";
import { AuthService } from "src/app/model/services/auth/auth.service";


@Injectable()
export class IsLoggedInGuard implements CanActivate, CanActivateChild{
    

    constructor(private authService: AuthService,
                    private router: Router){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        if(this.authService.authenticated){
            return true;
        }
        this.router.navigateByUrl("/login");
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(this.authService.authenticated){
            return true;
        }
        this.router.navigateByUrl("/login");
        return false;
    }

}