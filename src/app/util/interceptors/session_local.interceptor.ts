import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpEventType } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { Injectable, NgZone } from "@angular/core";
import { environment } from "src/environments/environment";
import { ResetAllServicesService } from "../../model/services/reset-all-services.service";
import { AuthService } from "../../model/services/auth/auth.service";
import { JwtHelper } from "../jwt-helper.model";
import { RestDataSource } from "src/app/model/rest.datasource";

@Injectable()
export class SessionLocalInterceptor implements HttpInterceptor {
   
    constructor(public auth: AuthService, private zone: NgZone, private resetAllServicesSrv: ResetAllServicesService, 
                    private restDataSource: RestDataSource) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event!=null && event.type==HttpEventType.Sent) {
                        if(this.isCurrentSessionTabExpired()){
                            this.resetAllServicesSrv.resetAllServices();
                            this.copyLocalTokenToSession();
                            this.reloadPage();
                            return;
                        }
                    }
                },
                (error: any) => {
                    if(this.isCurrentSessionTabExpired()){
                        this.resetAllServicesSrv.resetAllServices();
                        this.copyLocalTokenToSession();
                        this.reloadPage();
                        return;
                    }
                }
            )
        );
    }

    isCurrentSessionTabExpired(): boolean{
        //made this double checks for compatibility with edge browser
        if(sessionStorage.getItem(environment.TOKEN_SESS_STRING_MAP)==null || sessionStorage.getItem(environment.TOKEN_SESS_STRING_MAP)=='null'){
            this.copyLocalTokenToSession();
        }
        let areDiff: boolean= sessionStorage.getItem(environment.TOKEN_SESS_STRING_MAP) != localStorage.getItem(environment.TOKEN_LOC_STRING_MAP);
        
        return areDiff;
    }
   
    copyLocalTokenToSession(): void{
        if(localStorage.getItem(environment.TOKEN_LOC_STRING_MAP)==null 
                        || localStorage.getItem(environment.TOKEN_LOC_STRING_MAP)=='null'){
            sessionStorage.setItem(environment.TOKEN_SESS_STRING_MAP, null); //made this double checks for compatibility with edge
            localStorage.setItem(environment.TOKEN_LOC_STRING_MAP, null);
        }else{
            sessionStorage.setItem(environment.TOKEN_SESS_STRING_MAP, localStorage.getItem(environment.TOKEN_LOC_STRING_MAP));
            this.restDataSource.saveUsernameAndRole(localStorage.getItem(environment.TOKEN_LOC_STRING_MAP));
            this.restDataSource.saveMustLoginStatusInfo(
                localStorage.getItem(environment.MUST_CHANGE_PASSWORD_STRING_MAP),
                localStorage.getItem(environment.TWO_FA_IN_PROGRESS_STRING_MAP),
                )
        }
        
    }

    reloadPage() { // click handler or similar
        this.zone.runOutsideAngular(() => {
            location.reload();
        });
    }


}