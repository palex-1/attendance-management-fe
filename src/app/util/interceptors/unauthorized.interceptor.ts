import { CheckAuthenticationService } from "../../model/services/auth/check-authentication.service";
import { Injectable, NgZone } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { ResetAllServicesService } from "../../model/services/reset-all-services.service";
import { ChainExceptionHandler } from "../exceptions/chain-exception-handler.service";
import { Router } from "@angular/router";
import { AuthService } from "../../model/services/auth/auth.service";

declare const $: any;

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

    currentlyCheckNumber : number = 0;

    constructor(private checkAuthenticationSrv: CheckAuthenticationService,
                    private resetAllServicesSrv: ResetAllServicesService,
                        private router: Router, private zone: NgZone, 
                            private auth: AuthService){

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse) {
                        if(event.status === ChainExceptionHandler.UNAUTHORIZED){
                            this.manageUnauthorizedAccess();
                        }
                    }
                },
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === ChainExceptionHandler.UNAUTHORIZED) {
                            this.manageUnauthorizedAccess();
                        }
                    }
                }
            )
        );
    }


    manageUnauthorizedAccess(){
        if((this.currentlyCheckNumber>0)){
            return;
        }
        this.currentlyCheckNumber++;

        this.checkAuthenticationSrv.checkIfImLoggedUser().subscribe(
            (succ: boolean)=>{
                if(!succ){
                    this.executeLogout();
                }
                this.currentlyCheckNumber--;
            },
            (err: Response)=>{
                if(err!=null && err.status==ChainExceptionHandler.UNAUTHORIZED){
                    //infinite cicle avoid
                    this.executeLogout();
                    //this.reloadPage();
                }
                this.currentlyCheckNumber--;
            }
        );
    }

    executeLogout(){
        this.auth.logout();
        this.resetAllServicesSrv.resetAllServices();
        this.router.navigateByUrl("/login");
        $('.modal').modal('hide'); //hide all modals that could be opened.
    }

    reloadPage() { // click handler or similar
        this.zone.runOutsideAngular(() => {
            location.reload();
        });
    }
}