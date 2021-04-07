import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { RestDataSource } from "../../rest.datasource";
import { ChainExceptionHandler } from "../../../util/exceptions/chain-exception-handler.service";
import { MessageNotifierService } from "../../../dialogs/notifications/message-notifier.service";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { BackendUrlsService } from "../../backend-urls.service";
import { Params } from "@angular/router";
import { Observable, of, forkJoin, throwError } from "rxjs";
import { UserProfileDTO } from "../../dtos/profile/user-profile.dto";
import { GenericResponse } from "../../dtos/generic-response.model";
import { map, catchError } from "rxjs/operators";


@Injectable()
export class MyProfileService implements ResetableService{
    
    currentUser = new UserProfileDTO();
    dataAreLoaded: boolean = false;
   

    constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                  private exceptionHandler: ChainExceptionHandler) { 
          
    }
    
    reset(): void{
        this.dataAreLoaded = false;
        this.currentUser = new UserProfileDTO();
    }

    areDataLoaded(): boolean{
        return this.dataAreLoaded;
    }

    onResolveFailure(error: HttpErrorResponse): void{
    }

    
    loadInitialInformation(routeParams: Params, forceReload : boolean = false): Observable<any> {
        if(this.dataAreLoaded && !forceReload){
            return of(true);
        }
        return Observable.create(
            (observer) => {
              forkJoin(
                this.loadUserProfile()
                )
                .subscribe(
                  (successful) => {
                      this.dataAreLoaded = true;
                      observer.next(true);
                      observer.complete(); 
                    },
                  error =>{
                      
                      this.dataAreLoaded = false;
                      this.exceptionHandler.manageErrorWithLongChain(error.status);
                      observer.next(false);
                      observer.complete();
                  }
                );
            }
        );
        
    }
    

    private loadUserProfile(): Observable<any> {
        let params: HttpParams = new HttpParams()
        //params = params.append("profileImageCompression", "SMALL");

        return this.datasource.sendGetRequest<GenericResponse<UserProfileDTO>>(
            this.backendUrlsSrv.getUserProfile(), params, true).pipe(
            map((response: GenericResponse<UserProfileDTO>) => {
              this.currentUser = response.data;
              return true;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
        
    }
}