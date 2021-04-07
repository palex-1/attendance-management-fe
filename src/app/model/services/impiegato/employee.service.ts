import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Params, Router } from "@angular/router";
import { Observable, of, forkJoin, throwError } from "rxjs";
import { ChainExceptionHandler } from "src/app/util/exceptions/chain-exception-handler.service";
import { RestDataSource } from "../../rest.datasource";
import { BackendUrlsService } from "../../backend-urls.service";
import { GenericResponse } from "../../dtos/generic-response.model";
import { map, catchError } from "rxjs/operators";
import { EmployeeInfoDTO } from "../../dtos/impiegato/employee-info-dto.model";
import { CompanyDTO } from "../../dtos/company/company.dto";
import { UserProfileDTO } from "../../dtos/profile/user-profile.dto";
import { StringUtils } from "src/app/util/string/string-utils";
import { UserProfileAddressDTO } from "../../dtos/profile/user-profile-address.dto";
import { UserLevelDTO } from "../../dtos/profile/user-level.dto";
import { StringDTO } from '../../dtos/string-dto.model';


@Injectable()
export class EmployeeService implements ResetableService {
    
    dataAreLoaded: boolean = false;
    currentLoadedEmployeeInfo: EmployeeInfoDTO = new EmployeeInfoDTO();
    currentLoadedCompanies: CompanyDTO[] = [];
    currentLoadedUserLeves: UserLevelDTO[] = [];

    public employmentOffices: string[] = [];
   

    currentEmployeeId: number = null;

    constructor(private router: Router, private datasource: RestDataSource, 
                    private backendUlrsSrv: BackendUrlsService, private exceptionHandler: ChainExceptionHandler){

    }

    reset(): void {
       this.currentEmployeeId = null;
       this.dataAreLoaded = false;
       this.currentLoadedCompanies = [];
       this.currentLoadedEmployeeInfo = new EmployeeInfoDTO();
    }    

    loadInitialInformation(routeParams: Params, forceReload : boolean = false): Observable<any> {

        if (this.dataAreLoaded && !forceReload && routeParams.idEmployee==this.currentEmployeeId) {
            return of(true);
        }
    
        //if employee is different reset page old content
        if(routeParams.idEmployee!=this.currentEmployeeId){
            this.reset();
        }
    
        this.currentEmployeeId = routeParams.idEmployee;
        
        return Observable.create(
            (observer) => {
            forkJoin(
                    this.loadUserProfileDetails(routeParams.idEmployee),
                    this.loadAllCompanies(),
                    this.loadAllUserLevels(),
                    this.loadAllEmploymentOffices()
                )
                .subscribe(
                (successful) => {
                    this.dataAreLoaded = true;
                    observer.next(true);
                    observer.complete(); 
                    },
                error =>{
                    console.log(error)
                    this.dataAreLoaded = false;
                    observer.next(false);
                    observer.complete();
                }
                );
            }
        );
    }

    loadAllEmploymentOffices(): Observable<any>{
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getFindAllEmploymentOfficeUrl(), null, true)
        .pipe(
            map(
                (res: GenericResponse<StringDTO[]>)=>{
                    this.employmentOffices = [];

                    for(let i=0; i<res.data.length; i++){
                        this.employmentOffices.push(res.data[i].value);
                    }
                }
            )
        );
    }

    loadAllCompanies(): Observable<any>{
        
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getAllCompanies(), null, true)
        .pipe(
            map(
                (res: GenericResponse<CompanyDTO[]>)=>{
                    this.currentLoadedCompanies = res.data;
                }
            )
        );
    }

    loadAllUserLevels(): Observable<any>{
        
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getAllUserLevels(), null, true)
        .pipe(
            map(
                (res: GenericResponse<UserLevelDTO[]>)=>{
                    this.currentLoadedUserLeves = res.data;
                }
            )
        );
    }

    loadUserProfileDetails(idEmployee: any): Observable<any> {
        let params: HttpParams = new HttpParams();
        params = params.append("profileId", idEmployee);

        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getEmployeeDetails(), params, true)
        .pipe(
            map(
                (res: GenericResponse<EmployeeInfoDTO>)=>{
                    this.currentLoadedEmployeeInfo = res.data;
                }
            ),
            catchError((err) =>  {
                this.dataAreLoaded = false;
                this.exceptionHandler.manageErrorWithLongChain(err.status);
                //if error during get of employee occurs go to previuos page
                this.router.navigateByUrl('/dashboard/employeeManagement');

                return of(false); 
            })
        );
    }

    areDataLoaded(): boolean{
        return this.dataAreLoaded;
    }

    onResolveFailure(error: HttpErrorResponse): void {
    }

    updateOtherUserInfo(userProfileId: number, level: number, companyId: number, workedHoursField: number, leaveHoursField: number,
        vacationDaysField: number, employmentOfficeField: string){
        let form = {
            userProfileId: userProfileId,
            levelId: level,
            companyId: companyId,
            workDayHours: workedHoursField,
            leaveHours: leaveHoursField,
            vacationDays: vacationDaysField,
            employmentOffice: employmentOfficeField
        };


        return this.datasource.makePostJsonObject<GenericResponse<UserProfileDTO>>(
            this.backendUlrsSrv.getUpdateOtherProfileInfo(), form
        ).pipe(
            map((response: GenericResponse<UserProfileDTO>) => {
                this.currentLoadedEmployeeInfo.userProfile = response.data;

                return response;
            }),
            catchError((err) =>  {
                return throwError(err); 
            })
        ); 
    }

    


    updateDomicileOfUser(id: number, streetResidenceFieldPark: string, cityResidenceFieldPark: string, 
        provinceResidenceFieldPark: string, nationResidenceFieldPark: string, zipCodeResidenceFieldPark: string) {
        let form = {
            userProfileId: id,
            street: StringUtils.transformToNullIfWithespaceOrNullAndTrim(streetResidenceFieldPark),
            city: StringUtils.transformToNullIfWithespaceOrNullAndTrim(cityResidenceFieldPark),
            province: StringUtils.transformToNullIfWithespaceOrNullAndTrim(provinceResidenceFieldPark),
            nation: StringUtils.transformToNullIfWithespaceOrNullAndTrim(nationResidenceFieldPark), 
            zipCode: StringUtils.transformToNullIfWithespaceOrNullAndTrim(zipCodeResidenceFieldPark)
        };

        return this.datasource.makePostJsonObject<GenericResponse<UserProfileAddressDTO>>(
            this.backendUlrsSrv.getUpdateEmployeeDomicile(), form
            ).pipe(
                map((response: GenericResponse<UserProfileAddressDTO>) => {
                    this.currentLoadedEmployeeInfo.domicile = response.data;
        
                    return response;
                }),
                catchError((err) =>  {
                    return throwError(err); 
                })
            );
    }

    updateResidenceOfUser(id: number, streetDomicileFieldPark: string, cityDomicileFieldPark: string, provinceDomicileFieldPark: string,
        nationDomicileFieldPark: string, zipCodeDomicileFieldPark: string) {
       let form = {
        userProfileId: id,
        street: StringUtils.transformToNullIfWithespaceOrNullAndTrim(streetDomicileFieldPark),
        city: StringUtils.transformToNullIfWithespaceOrNullAndTrim(cityDomicileFieldPark),
        province: StringUtils.transformToNullIfWithespaceOrNullAndTrim(provinceDomicileFieldPark),
        nation: StringUtils.transformToNullIfWithespaceOrNullAndTrim(nationDomicileFieldPark), 
        zipCode: StringUtils.transformToNullIfWithespaceOrNullAndTrim(zipCodeDomicileFieldPark)
      };

      return this.datasource.makePostJsonObject<GenericResponse<UserProfileAddressDTO>>(
        this.backendUlrsSrv.getUpdateEmployeeResidence(), form
      ).pipe(
            map((response: GenericResponse<UserProfileAddressDTO>) => {
            this.currentLoadedEmployeeInfo.residence = response.data;

            return response;
            }),
            catchError((err) =>  {
            return throwError(err); 
            })
      );

    }


    updateUsernameOfUser(id: number, usernamePark: string) {
        let emailTrimmed = StringUtils.transformToNullIfWithespaceOrNullAndTrim(usernamePark);

        let form = {
            userProfileId: id,
            email: emailTrimmed
        };

        let mustUpdateUsername = false;

        //change email in datastore also if user is updating his email
        if(this.datasource.username==emailTrimmed){
            mustUpdateUsername = true;
        }

        return this.datasource.makePostJsonObject<GenericResponse<UserProfileDTO>>(
            this.backendUlrsSrv.getUpdateUsernameProfileInfo(), form
        ).pipe(
            map((response: GenericResponse<UserProfileDTO>) => {
                this.currentLoadedEmployeeInfo.userProfile = response.data;
                
                this.datasource.saveUsernameUpdated(this.currentLoadedEmployeeInfo.userProfile.email);

                return response;
            }),
            catchError((err) =>  {
                return throwError(err); 
            })
        ); 
    }

    updatePersonalDataOfUser(id: number, cfPark: string, namePark: string, surnamePark: string, 
                            phoneNumberPark: string, birthDate: Date, sex: string, dateOfEmployment: Date) {
        let form = {
            userProfileId: id,
            name: StringUtils.transformToNullIfWithespaceOrNullAndTrim(namePark),
            surname: StringUtils.transformToNullIfWithespaceOrNullAndTrim(surnamePark),
            cf: StringUtils.transformToNullIfWithespaceOrNullAndTrim(cfPark),
            birthDate: birthDate,
            employmentDate: dateOfEmployment,
            phoneNumber: StringUtils.transformToNullIfWithespaceOrNullAndTrim(phoneNumberPark),
            sex: StringUtils.transformToNullIfWithespaceOrNullAndTrim(StringUtils.toUpperCase(sex))
        };
        
        return this.datasource.makePostJsonObject<GenericResponse<UserProfileDTO>>(
            this.backendUlrsSrv.getUpdateEmployeeProfile(), form
        ).pipe(
            map((response: GenericResponse<UserProfileDTO>) => {
                this.currentLoadedEmployeeInfo.userProfile = response.data;

                return response;
            }),
            catchError((err) =>  {
                return throwError(err); 
            })
        ); 
    }



    generateUserProfileBadge(): Observable<any> {
        let params: HttpParams = new HttpParams()
        params = params.append('userProfileId', this.currentEmployeeId+'')
        
        return this.datasource.downloadFile(this.backendUlrsSrv.getGenerateBadgeUrl(), params, true, true, false);
    }



}