import { Injectable } from "@angular/core";
import { RestDataSource } from "../../rest.datasource";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { GenericResponse } from "../../dtos/generic-response.model";
import { ChangePasswordRequestDTO } from "../../dtos/change-password-request-dto.model";
import { ResetPasswordCompleteDTO } from "../../dtos/reset-password-complete-dto";
import { ChangePasswordDTO } from "../../dtos/change-password-dto.model";
import { BackendUrlsService } from "../../backend-urls.service";

@Injectable()
export class AuthDetailsService {

    constructor(private datasource: RestDataSource,
                    private backendUlrSrv: BackendUrlsService){
    }

    changePassword(oldPsw: string, newPsw: string): Observable<GenericResponse<any>>{
        let params: HttpParams = new HttpParams();
        let changePSWDTO: ChangePasswordDTO = new ChangePasswordDTO(oldPsw, newPsw);
        // (url: string, form: any, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders(), 
        // authenticated: boolean = false, withCredentials: boolean = false)
        
        return this.datasource.makePutJsonObject<GenericResponse<any>>(this.backendUlrSrv.getChangePasswordUrl(), 
                    changePSWDTO, params, new HttpHeaders(), true, false, true);
    }
    
    forcePasswordChangeToLogin(newPsw: string): Observable<GenericResponse<any>>{
        let params: HttpParams = new HttpParams();
        let changePSWDTO: ChangePasswordDTO = new ChangePasswordDTO(null, newPsw);
        
        return this.datasource.makePutJsonObject<GenericResponse<any>>(this.backendUlrSrv.getForcePasswordChangeToLogin(), 
                    changePSWDTO, params, new HttpHeaders(), true, false, true);
    }

    requestPasswordRecovery(username: string): Observable<GenericResponse<any>>{
        let params = new HttpParams();
        params = params.append('username', username);
        
        let headers: HttpHeaders = new HttpHeaders();

        return this.datasource.makePostJsonObject<GenericResponse<any>>(
            this.backendUlrSrv.getRequestChangePasswordUrl(), null, params, headers, false, false, true
            );
    }
    
    completePasswordRecovery(resetPswCompleteRequest: ResetPasswordCompleteDTO): Observable<GenericResponse<any>>{
        return this.datasource.makePostJsonObjectForm(this.backendUlrSrv.getCompleteChangePasswordUrl(), 
                                                            resetPswCompleteRequest, false, false, true);
    }

}