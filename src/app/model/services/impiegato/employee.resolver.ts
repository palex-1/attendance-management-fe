import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "src/app/dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { EmployeeService } from "./employee.service";
import { Injectable } from "@angular/core";
import { EmployeeTeamsService } from './employee-teams.service';
import { EmployeePaycheckService } from './employee-paycheck.service';
import { EmployeePersonalDocumentService } from './employee-personal-document.service';
import { AuthoritiesService } from '../auth/authorities.service';
import { CompareAttendanceAndWorkedHours } from './compare-attendance-and-worked-hours.service';

@Injectable()
export class EmployeeResolver extends AbstractResolver {

    constructor(private employeeService: EmployeeService, private employeeTeamsService: EmployeeTeamsService,
                    private employeePaycheckService: EmployeePaycheckService, private loader: LoadingService,
                        private employeePersonalDocumentService: EmployeePersonalDocumentService,
                            private compareAttendanceAndWorkedHours: CompareAttendanceAndWorkedHours,
                                private authoritiesService: AuthoritiesService){
        super();
    }

    getLoadingService(): LoadingService {
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.employeeService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.employeeService.reset();
        this.employeeTeamsService.reset();
        this.employeePaycheckService.reset();
        this.employeePersonalDocumentService.reset();
        this.compareAttendanceAndWorkedHours.reset();

        this.getLoadingService().startLoading();

        let observable: Observable<any>  = forkJoin(
            this.employeeService.loadInitialInformation(route.params),
            this.employeeTeamsService.loadInitialInformation(route.params),
            this.employeePaycheckService.loadInitialInformation(route.params),
            this.employeePersonalDocumentService.loadInitialInformation(route.params),
            this.compareAttendanceAndWorkedHours.loadInitialInformation(route.params)
        );

        //if user cannot access to personal document do not call findAll
        if(!this.authoritiesService.hasAuthority(['PERSONAL_DOCUMENT_READ'])){
            observable = forkJoin(
                this.employeeService.loadInitialInformation(route.params),
                this.employeeTeamsService.loadInitialInformation(route.params),
                this.compareAttendanceAndWorkedHours.loadInitialInformation(route.params)
            );
        }

        return Observable.create(
            (observer) => { 
                if(observable==null){
                    observer.next(true);
                    observer.complete(); 
                    return;
                }
                observable.subscribe(
                    (successful) => {
                        if(successful){
                            observer.next(true);
                            observer.complete(); 
                        }else{
                            this.getLoadingService().endLoading()
                            observer.next(false);
                        }
                    },
                )
            }
        )
    }

}