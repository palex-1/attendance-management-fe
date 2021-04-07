import { Injectable, NgZone } from "@angular/core";
import { HttpRequest, HttpClient, HttpHeaders, HttpEvent, HttpParams, HttpResponse, HttpBackend } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { JwtHelper } from "../util/jwt-helper.model";


const TOKEN_START: string = "Bearer ";
const AUTHORIZATION_HEADER : string = "Authorization";

const USERNAME_LOC_STRING_MAP: string = 'username';
const USERNAME_SESS_STRING_MAP: string = 'username';

const ROLE_LOC_STRING_MAP: string = 'permission_group';
const ROLE_SESS_STRING_MAP: string = 'permission_group';


/**
 * @author Alessandro Pagliaro
 * 
 */
@Injectable()
export class RestDataSource {
    
    jwtHelper: JwtHelper;
    notInterceptedHttpClient: HttpClient;

    constructor(private httpClient: HttpClient, handler: HttpBackend,
                    private zone: NgZone) {
        this.jwtHelper = new JwtHelper();
        this.notInterceptedHttpClient = new HttpClient(handler);
    }

    saveAuthToken(token: string, mustResetPassword: boolean, twoFactorAuthenticationInProgress: boolean): void{
        localStorage.setItem(environment.TOKEN_LOC_STRING_MAP, token);
        sessionStorage.setItem(environment.TOKEN_SESS_STRING_MAP, token);

        this.saveMustLoginStatusInfo(mustResetPassword, twoFactorAuthenticationInProgress);
        this.saveUsernameAndRole(token);
    }

    saveMustLoginStatusInfo(mustResetPassword, twoFactorAuthenticationInProgress){
        localStorage.setItem(environment.MUST_CHANGE_PASSWORD_STRING_MAP, mustResetPassword+'');
        sessionStorage.setItem(environment.MUST_CHANGE_PASSWORD_STRING_MAP, mustResetPassword+'');

        localStorage.setItem(environment.TWO_FA_IN_PROGRESS_STRING_MAP, twoFactorAuthenticationInProgress+'');
        sessionStorage.setItem(environment.TWO_FA_IN_PROGRESS_STRING_MAP, twoFactorAuthenticationInProgress+'');
    }

    saveUsernameUpdated(username){
        localStorage.setItem(USERNAME_LOC_STRING_MAP, username);

        sessionStorage.setItem(USERNAME_SESS_STRING_MAP, username);
    }

    saveUsernameAndRole(token: string){
        let tokenContent: any = this.jwtHelper.decodeToken(token);

        localStorage.setItem(USERNAME_LOC_STRING_MAP, tokenContent.username);
        localStorage.setItem(ROLE_LOC_STRING_MAP, tokenContent.permission_group);

        sessionStorage.setItem(USERNAME_SESS_STRING_MAP, tokenContent.username);
        sessionStorage.setItem(ROLE_SESS_STRING_MAP, tokenContent.permission_group);
    }

    get username() {
        return localStorage.getItem(USERNAME_LOC_STRING_MAP);
    }

    get permissionGroup() {
        return localStorage.getItem(ROLE_LOC_STRING_MAP);
    }

    get mustResetPassword(){
        return localStorage.getItem(environment.MUST_CHANGE_PASSWORD_STRING_MAP);
    }

    get twoFactorAuthenticationInProgress(){
        return localStorage.getItem(environment.TWO_FA_IN_PROGRESS_STRING_MAP);
    }
      
    getAuthToken(): string{
        return localStorage.getItem(environment.TOKEN_LOC_STRING_MAP);
    }

    deleteAuthToken(): void{
        localStorage.removeItem(environment.TOKEN_LOC_STRING_MAP);
        sessionStorage.removeItem(environment.TOKEN_SESS_STRING_MAP,);
        localStorage.removeItem(USERNAME_LOC_STRING_MAP);
        localStorage.removeItem(ROLE_LOC_STRING_MAP);

        sessionStorage.removeItem(USERNAME_SESS_STRING_MAP);
        sessionStorage.removeItem(ROLE_SESS_STRING_MAP);

        localStorage.removeItem(environment.MUST_CHANGE_PASSWORD_STRING_MAP);
        sessionStorage.removeItem(environment.MUST_CHANGE_PASSWORD_STRING_MAP);

        localStorage.removeItem(environment.TWO_FA_IN_PROGRESS_STRING_MAP);
        sessionStorage.removeItem(environment.TWO_FA_IN_PROGRESS_STRING_MAP);
    }

    isCurrentTokenExpired(): boolean{
        if( this.getAuthToken()==null || this.getAuthToken()=="null" ){
            return true;
        }
        try{
            if(this.jwtHelper.isTokenExpired(this.getAuthToken())){
                return true;
            }
          }catch(error){
            return true;
        }
        return false;
    }


    reloadPage() { // click handler or similar
        this.zone.runOutsideAngular(() => {
            location.reload();
        });
    }

    public makePostJsonObject<T>(url: string, form: any, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders(), 
                            authenticated: boolean = true, withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<T> {
        let header: HttpHeaders = headers;
        header = header.append('Content-Type', 'application/json');
        if(authenticated){
            header = header.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }

        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.post<T>(url, form, { headers: header, params: params, withCredentials: withCredentials } );
    }

    public makePostJsonObjectForm<T>(url: string, form: any, authenticated: boolean = true, withCredentials: boolean = false,
                disableInterceptor: boolean = false): Observable<T> {
        return this.makePostJsonObject<T>(url, form, new HttpParams(), new HttpHeaders(), authenticated, withCredentials, disableInterceptor);
    }

    public makePostJsonObjectObservingResponse<T>(url: string, form: any, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders(), 
                            authenticated: boolean = true, withCredentials: boolean = false, observeResponse: boolean = false,
                            disableInterceptor: boolean = false): Observable<HttpResponse<T>> {
        let header: HttpHeaders = headers;
        header = header.append('Content-Type', 'application/json');
        if(authenticated){
            header = header.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }

        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.post<T>(url, form, { headers: header, params: params, withCredentials: withCredentials, observe: 'response' });
    }

    public makePutJsonObjectForm<T>(url: string, form: any, authenticated: boolean = true, withCredentials: boolean = false,
        disableInterceptor: boolean = false): Observable<T> {
        return this.makePutJsonObject<T>(url, form, new HttpParams(), new HttpHeaders(), authenticated, withCredentials, disableInterceptor);
    }

    public makePutJsonObject<T>(url: string, form: any, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders(), 
                authenticated: boolean = true, withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<T> {
        let header: HttpHeaders = headers;
        header = header.append('Content-Type', 'application/json');
        if(authenticated){
            header = header.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }
        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.put<T>(url, form, { headers: header, params: params, withCredentials: withCredentials } );
    }

    public makePutJsonObjectObservingResponse<T>(url: string, form: any, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders(), 
                authenticated: boolean = true, withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<HttpResponse<T>> {
        let header: HttpHeaders = headers;
        header = header.append('Content-Type', 'application/json');
        if(authenticated){
            header = header.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }
    
        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.put<T>(url, form, { headers: header, params: params, withCredentials: withCredentials, observe: 'response' });
    }



    public uploadWithPost(url: string, formData: FormData, params: HttpParams = new HttpParams(), 
        headers: HttpHeaders = new HttpHeaders(), authenticated: boolean = true, withCredentials: boolean = false): Observable<HttpEvent<any>>{
        
            let header: HttpHeaders = headers;
        if(authenticated){
            header = header.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }
        const request = new HttpRequest("POST", url, formData, {
            reportProgress: true,
            headers: header,
            params: params,
            withCredentials: withCredentials
        });

        
        return this.httpClient.request(request);
    }

    downloadData(url: string): void {
        let finalUrl: string = url;
        //start download in onother page
        window.open(finalUrl, '_blank');
    }

    downloadFile(url: string, params: HttpParams = new HttpParams(), authenticated: boolean = true,
                withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        if(authenticated){
            headers = headers.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }

        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.get(url, { headers: headers, params: params, withCredentials: withCredentials, 
            observe: 'response',  responseType: 'blob'});
    }

    
    public sendGetRequest<T>(url: string, params: HttpParams = new HttpParams(), authenticated: boolean = true,
        withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        if(authenticated){
            headers = headers.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }

        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.get<T>(url, { headers: headers, params: params, withCredentials: withCredentials } );
    }

    public sendGetRequestObservingResponse<T>(url: string, params: HttpParams, authenticated: boolean = true,
        withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<HttpResponse<T>>{
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        if(authenticated){
            headers = headers.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }

        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.get<T>( url, { headers: headers, params: params, withCredentials: withCredentials, observe: 'response' });
        
    }


    public sendDeleteRequest<T>(url: string, params: HttpParams, authenticated: boolean = true, 
        withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<T> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        if(authenticated){
            headers = headers.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }

        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.delete<T>(url, { headers: headers, params: params, withCredentials: withCredentials } );
    }

    public sendDeleteRequestObservingResponse<T>(url: string, params: HttpParams, authenticated: boolean = true, 
        withCredentials: boolean = false, disableInterceptor: boolean = false): Observable<HttpResponse<T>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        if(authenticated){
            headers = headers.append(AUTHORIZATION_HEADER, TOKEN_START+this.getAuthToken()+"");
        }

        let httpClientSelected = this.httpClient;
        if(disableInterceptor){
            httpClientSelected = this.notInterceptedHttpClient;
        }

        return httpClientSelected.delete<T>(url, { headers: headers, params: params, withCredentials: withCredentials, observe: 'response' });
        
    }
  

}