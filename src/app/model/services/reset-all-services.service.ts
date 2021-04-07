import { AuthService } from "./auth/auth.service";
import { AuthoritiesService } from "./auth/authorities.service";
import { Injectable } from "@angular/core";
import { SuccessfullyLoginLogsService } from "./auth/successfully-login-logs.service";
import { IncaricoService } from "./incarico/incarico.service";
import { SediLavorativeService } from "./sede/sedi-lavorative.service";
import { MyProfileService } from "./my-profile/my-profile.service";
import { EmployeeManagementService } from "./impiegato/employee-management.service";
import { EmployeeTeamsService } from './impiegato/employee-teams.service';
import { CompletedTaskOfDayService } from './incarico/completed-task-of-day.service';
import { MyPaychecksService } from './impiegato/my-paychecks.service';
import { EmployeePersonalDocumentService } from './impiegato/employee-personal-document.service';
import { UserLevelsService } from './settings/user-levels.service';
import { HomeService } from './home/home.service';
import { CompaniesService } from "./settings/companies.service";


@Injectable()
export class ResetAllServicesService {

    constructor(private authoritiesService: AuthoritiesService,
                private successfullyLoginLogsService: SuccessfullyLoginLogsService,
                private incaricoService: IncaricoService,
                private sediLavorativeSrv: SediLavorativeService,
                private myProfileSrv: MyProfileService,
                private employeeManagementService: EmployeeManagementService,
                private employeeTeamsService: EmployeeTeamsService,
                private completedTaskOfDayService: CompletedTaskOfDayService,
                private myPaychecksService: MyPaychecksService,
                private employeePersonalDocumentService: EmployeePersonalDocumentService,
                private userLevelsService: UserLevelsService,
                private homeService: HomeService,
                private companiesService: CompaniesService
                        ){

    }

    resetAllServices(){
        this.authoritiesService.reset();
        this.successfullyLoginLogsService.reset();
        this.incaricoService.reset();
        this.sediLavorativeSrv.reset();
        this.myProfileSrv.reset();
        this.employeeManagementService.reset();
        this.employeeTeamsService.reset();
        this.completedTaskOfDayService.reset();
        this.myPaychecksService.reset();
        this.employeePersonalDocumentService.reset();
        this.userLevelsService.reset();
        this.homeService.reset();
        this.companiesService.reset();
    }

}