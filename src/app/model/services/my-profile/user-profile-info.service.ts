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
import { UserProfileAddressDTO } from "../../dtos/profile/user-profile-address.dto";
import { UserProfileInfoDTO } from "../../dtos/profile/user-profile-info.dto";
import { StringUtils } from "src/app/util/string/string-utils";


@Injectable()
export class UserProfileInfoService implements ResetableService{
  
    currentUser = new UserProfileDTO();
    currentDomicile = new UserProfileAddressDTO();
    currentResidence = new UserProfileAddressDTO();

    dataAreLoaded: boolean = false;
   

    constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                  private exceptionHandler: ChainExceptionHandler) { 
          
    }
    
    reset(): void{
        this.dataAreLoaded = false;
        this.currentUser = new UserProfileDTO();
        this.currentDomicile = new UserProfileAddressDTO();
        this.currentResidence = new UserProfileAddressDTO();
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
                this.loadUserProfileInfo()
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
    

    private loadUserProfileInfo(): Observable<any> {
        let params: HttpParams = new HttpParams()
        //params = params.append("profileImageCompression", "SMALL");

        return this.datasource.sendGetRequest<GenericResponse<UserProfileInfoDTO>>(
            this.backendUrlsSrv.getUserProfileInfo(), params, true).pipe(
            map((response: GenericResponse<UserProfileInfoDTO>) => {
              if(response.data!=null){
                if(response.data.userProfile==null){
                  this.currentUser = new UserProfileDTO();
                }else{
                  this.currentUser = response.data.userProfile;
                }
                
                if(response.data.domicile==null){
                  this.currentDomicile = new UserProfileAddressDTO();
                }else{
                  this.currentDomicile = response.data.domicile;
                }
    
                if(response.data.residence==null){
                  this.currentResidence = new UserProfileAddressDTO();
                }else{
                  this.currentResidence = response.data.residence;
                }
                
              }
              
              return true;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
        
    }


    updateProfileImage(choosenFile: File): Observable<any>{
      let formData: FormData = new FormData();
      formData.set('image', choosenFile);

      return this.datasource.uploadWithPost(this.backendUrlsSrv.getUploadProfileImage(), formData);
    }


    updateResidence(streetDomicileFieldPark: string, cityDomicileFieldPark: string, provinceDomicileFieldPark: string,
          nationDomicileFieldPark: string, zipCodeDomicileFieldPark: string) {

        return this.datasource.makePostJsonObject<GenericResponse<UserProfileAddressDTO>>(
          this.backendUrlsSrv.getUpdateProfileResidence(), {
            street: streetDomicileFieldPark,
            city: cityDomicileFieldPark,
            province: provinceDomicileFieldPark,
            nation: nationDomicileFieldPark, 
            zipCode: zipCodeDomicileFieldPark
          }
        ).pipe(
          map((response: GenericResponse<UserProfileAddressDTO>) => {
            this.currentResidence = response.data;
  
            return response;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );

    }

    
    updateDomicile(streetResidenceFieldPark: string, cityResidenceFieldPark: string, provinceResidenceFieldPark: string, 
      nationResidenceFieldPark: string, zipCodeResidenceFieldPark: string) {
      
        return this.datasource.makePostJsonObject<GenericResponse<UserProfileAddressDTO>>(
          this.backendUrlsSrv.getUpdateProfileDomicile(), {
            street: streetResidenceFieldPark,
            city: cityResidenceFieldPark,
            province: provinceResidenceFieldPark,
            nation: nationResidenceFieldPark, 
            zipCode: zipCodeResidenceFieldPark
          }
        ).pipe(
          map((response: GenericResponse<UserProfileAddressDTO>) => {
            this.currentDomicile = response.data;
  
            return response;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );
    }

    updatePersonalData(cfPark: string, namePark: string, surnamePark: string, 
              phoneNumberPark: string, birthDate: Date): Observable<GenericResponse<UserProfileDTO>> {
      
      return this.datasource.makePostJsonObject<GenericResponse<UserProfileDTO>>(this.backendUrlsSrv.getUpdateUserProfile(),
        {
          name: StringUtils.transformToNullIfWithespaceOrNullAndTrim(namePark),
          surname: StringUtils.transformToNullIfWithespaceOrNullAndTrim(surnamePark),
          cf: StringUtils.transformToNullIfWithespaceOrNullAndTrim(cfPark),
          birthDate: birthDate,
          phoneNumber: StringUtils.transformToNullIfWithespaceOrNullAndTrim(phoneNumberPark)
        }
      ).pipe(
        map((response: GenericResponse<UserProfileDTO>) => {
          this.currentUser = response.data;

          return response;
        }),
        catchError((err) =>  {
          return throwError(err); 
        })
      );     
    }

}