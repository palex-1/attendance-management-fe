import { Injectable, OnInit } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { AuthService } from "./auth.service";
import { Params } from "@angular/router";
import { Observable, forkJoin, throwError, of } from "rxjs";
import { ChainExceptionHandler } from "src/app/util/exceptions/chain-exception-handler.service";
import { RestDataSource } from "../../rest.datasource";
import { map, catchError } from "rxjs/operators";
import { GenericResponse } from "../../dtos/generic-response.model";
import { AuthoritiesDTO } from "../../dtos/authoritiesDTO.model";
import { HttpParams, HttpErrorResponse } from "@angular/common/http";
import { BackendUrlsService } from "../../backend-urls.service";



@Injectable()
export class AuthoritiesService implements ResetableService, OnInit{
    

    dataAreLoaded: boolean = false;
    authorities: string[] = [];
    user_id: string;

    constructor(private authService: AuthService, private backendUrlsSrv: BackendUrlsService,
                  private exceptionHandler: ChainExceptionHandler,
                    private datasource: RestDataSource){
        
    }

    
    ngOnInit(){
        this.user_id = "";
    }

    hasAllAuthority(authorities: string[]): boolean | Observable<boolean> {
      if(!this.dataAreLoaded){
        return this.hasAllAuthorityRemoteCheck(authorities);
      }
      return this.hasAllAuthorityLocalCheck(authorities);
    }

    hasAllAuthorityLocalCheck(authorities: string[]): any {
      if(authorities==null || this.authorities==null){
        return false;
      }
      for(var i: number=0; i<authorities.length; i++){
        if(!this.hasSpecificAuthority(authorities[i])){
          return false;
        }
      }
      return true;
    }

    hasAuthority(authorities: string[]) : Observable<boolean> | boolean {
      if(!this.dataAreLoaded){
        return this.hasAuthorityRemoteCheck(authorities);
      }
      return this.hasAuthorityLocalCheck(authorities);
    }

    hasAuthorityLocalCheck(authorities: string[]): boolean{
      if(authorities==null || this.authorities==null){
        return false;
      }
      for(var i: number=0; i<authorities.length; i++){
        if(this.hasSpecificAuthority(authorities[i])){
          return true;
        }
      }
      return false;
    }
    private hasSpecificAuthority(authority: string): boolean{
      for(var i: number=0; i<this.authorities.length; i++){
        if(this.authorities[i]==authority){
          return true;
        }
      }
      return false;
    }

    areDataLoaded(): boolean{
        return this.dataAreLoaded;
    }

    reset(): void{
        this.dataAreLoaded = false;
        this.authorities = [];
    }

    
    onResolveFailure(error: HttpErrorResponse): void{
    }

    loadInitialInformation(routeParams: Params): Observable<boolean>{
        if(this.dataAreLoaded){
          return of(true);
        }
        return Observable.create(
            (observer) => {
              forkJoin(
                this.getUserAuthorities(this.user_id)
                )
                .subscribe(
                  (successful) => {
                      this.dataAreLoaded = true;
                      observer.next(true);
                      observer.complete(); 
                    }
                    ,error => {
                      this.dataAreLoaded = false;
                      this.exceptionHandler.manageErrorWithLongChain(error.status);
                      observer.next(false);
                      observer.complete();
                  }
                );
            }
        );
    }

    private hasAuthorityRemoteCheck(authorities: string[]): Observable<any>{

      return this.datasource.sendGetRequest<GenericResponse<AuthoritiesDTO>>(this.backendUrlsSrv.getLoadAuthoritiesUrl(), 
      new HttpParams(), true)
      .pipe(
            map((response: GenericResponse<AuthoritiesDTO>) => {
              this.authorities = response.data.authorities;
              this.dataAreLoaded = true;
              return this.hasAuthorityLocalCheck(authorities);
            }),
            catchError((err) =>  {
              this.dataAreLoaded = false;
              this.exceptionHandler.manageErrorWithLongChain(err);
              return throwError(err); 
            })
          );
    }

    private hasAllAuthorityRemoteCheck(authorities: string[]): Observable<any>{

      return this.datasource.sendGetRequest<GenericResponse<AuthoritiesDTO>>(this.backendUrlsSrv.getLoadAuthoritiesUrl(), 
      new HttpParams(), true)
      .pipe(
            map((response: GenericResponse<AuthoritiesDTO>) => {
              this.authorities = response.data.authorities;
              this.dataAreLoaded = true;
              return this.hasAllAuthorityLocalCheck(authorities);
            }),
            catchError((err) =>  {
              this.dataAreLoaded = false;
              this.exceptionHandler.manageErrorWithLongChain(err);
              return throwError(err); 
            })
          );
    }
 

    private getUserAuthorities(userID: string): Observable<any>{
      
      return this.datasource.sendGetRequest<GenericResponse<AuthoritiesDTO>>(this.backendUrlsSrv.getLoadAuthoritiesUrl(), 
      new HttpParams(), true)
        .pipe(
              map((response: GenericResponse<AuthoritiesDTO>) => {
                this.authorities = response.data.authorities;

                return true;
              }),
              catchError((err) =>  {
                return throwError(err); 
              })
            );
    }
    
}