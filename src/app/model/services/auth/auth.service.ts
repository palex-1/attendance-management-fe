import { Injectable, NgZone } from "@angular/core";
import { Observable, of, forkJoin } from "rxjs";
import { Params, Router } from "@angular/router";
import { RestDataSource } from "../../rest.datasource";
import { ResetableService } from "../resetable-service.model";
import { JwtHelper } from "src/app/util/jwt-helper.model";
import { HttpParams } from "@angular/common/http";
import { AuthoritiesService } from "./authorities.service";
import { ResetAllServicesService } from "../reset-all-services.service";
import { AuthenticationDTO } from "../../dtos/authentication-dto.model";
import { BackendUrlsService } from "../../backend-urls.service";
import { GenericResponse } from "../../dtos/generic-response.model";
import { StringDTO } from "../../dtos/string-dto.model";

@Injectable()
export class AuthService{
  
    
    jwtHelper: JwtHelper;

    constructor(private router: Router, private datasource: RestDataSource,
                  private zone: NgZone, private backendUrlSrv: BackendUrlsService){
          this.jwtHelper = new JwtHelper();
    }

    authenticate(username: string, password: string){
       let params: HttpParams = new HttpParams();
       let authDTO: AuthenticationDTO = new AuthenticationDTO(username, password);

       return this.datasource.makePostJsonObjectObservingResponse(this.backendUrlSrv.getLoginUrl(), authDTO, params);
    }

    saveAuthToken(token: string, mustResetPassword: boolean = false, twoFactorAuthenticationInProgress: boolean = false){
      if(token!=null){
        if(token.startsWith("Bearer ")){
            this.datasource.saveAuthToken(token.substring(7, token.length), mustResetPassword, twoFactorAuthenticationInProgress);
            return;
        }
      }
      this.datasource.saveAuthToken(token, mustResetPassword, twoFactorAuthenticationInProgress);
    }

    updateLoginStatus(mustResetPassword: boolean, twoFactorAuthenticationInProgress: boolean){
      this.datasource.saveMustLoginStatusInfo(mustResetPassword, twoFactorAuthenticationInProgress);
    }

    completeOTPAuthentication(otp: string): Observable<GenericResponse<StringDTO>>{
      let otpReq = {
        token: this.datasource.getAuthToken(),
        otp: otp
      }

      return this.datasource.makePostJsonObject<GenericResponse<StringDTO>>(this.backendUrlSrv.getCompleteOTPLoginUrl(), otpReq);
    }

    get username(): string {
      return this.datasource.username;
    }
  
    get permissionGroup(): string {
      return this.datasource.permissionGroup;
    }

    get authenticated(): boolean {
        return this.isCurrentTokenValid() && !this.mustResetPassword && !this.twoFactorAuthenticationInProgress;
    }

    get mustResetPassword(): boolean{
      return this.datasource.mustResetPassword=='true';
    }

    get twoFactorAuthenticationInProgress(): boolean{
      return this.datasource.twoFactorAuthenticationInProgress=='true';
    }

    logout(): void {
      this.datasource.deleteAuthToken();
    }

    redirectToLogin(): void{
        this.router.navigateByUrl("/login");
    }
  
    reloadPage() { // click handler or similar
        this.zone.runOutsideAngular(() => {
            location.reload();
        });
    }

    refreshToken(): void{
      // this.datasource.refreshAuthToken();
    }

   public isCurrentTokenValid(): boolean{
      //console.log(this.getAuthToken());
      if(this.datasource.getAuthToken()==null || this.datasource.getAuthToken()=="null"){
          return false;
      }
      return !this.isCurrentTokenExpired();
  }

   isCurrentTokenExpired(): boolean{
    if(this.datasource.isCurrentTokenExpired()){
        this.datasource.deleteAuthToken();
        return true;
    }
    return false;
  }


}