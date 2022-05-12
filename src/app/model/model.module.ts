import { NgModule } from "@angular/core";
import { RestDataSource } from "./rest.datasource";
import { AuthService } from "./services/auth/auth.service";
import { AuthoritiesService } from "./services/auth/authorities.service";
import { AuthoritiesResolver } from "./services/auth/authorities.resolver";
import { ResetAllServicesService } from "./services/reset-all-services.service";
import { AuthDetailsService } from "./services/auth/authDetails.service";
import { ImpiegatoService } from "./services/impiegato/impiegato.service";
import { SuccessfullyLoginLogsService } from "./services/auth/successfully-login-logs.service";
import { SuccessfullyLoginLogsResolver } from "./services/auth/successfully-login-logs.resolver";
import { FrontendLoggerService } from "./services/system/frontend-logger.service";
import { IncaricoService } from "./services/incarico/incarico.service";
import { IncaricoResolver } from "./services/incarico/incarico.resolver";
import { SediLavorativeService } from "./services/sede/sedi-lavorative.service";
import { SediLavorativeResolver } from "./services/sede/sedi-lavorative.resolver";
import { CheckAuthenticationService } from "./services/auth/check-authentication.service";
import { DettagliIncaricoService } from "./services/incarico/dettagli-incarico.service";
import { DettagliIncaricoResolver } from "./services/incarico/dettagli-incarico.resolver";
import { BackendUrlsService } from "./backend-urls.service";
import { MyProfileResolver } from "./services/my-profile/my-profile.resolver";
import { MyProfileService } from "./services/my-profile/my-profile.service";
import { UserProfileInfoService } from "./services/my-profile/user-profile-info.service";
import { UserProfileInfoResolver } from "./services/my-profile/user-profile-info.resolver";
import { EmployeeManagementResolver } from "./services/impiegato/employee-management.resolver";
import { EmployeeManagementService } from "./services/impiegato/employee-management.service";
import { EmployeeService } from "./services/impiegato/employee.service";
import { EmployeeResolver } from "./services/impiegato/employee.resolver";
import { EmployeeTeamsService } from './services/impiegato/employee-teams.service';
import { CompletedTaskOfDayService } from './services/incarico/completed-task-of-day.service';
import { CompletedTaskOfDayResolver } from './services/incarico/completed-task-of-day.resolver';
import { TaskOfUserService } from './services/impiegato/task-of-user.service';
import { EmployeePaycheckService } from './services/impiegato/employee-paycheck.service';
import { TicketDownloadService } from './services/system/ticket-download.service';
import { MyPaychecksService } from './services/impiegato/my-paychecks.service';
import { PersonalDocumentsResolver } from './services/impiegato/personal-documents.resolver';
import { EmployeePersonalDocumentService } from './services/impiegato/employee-personal-document.service';
import { MyPersonalDocumentService } from './services/impiegato/my-personal-document.service';
import { WorkTaskSummaryService } from './services/incarico/work-task-summary.service';
import { WorkTaskSummaryResolver } from './services/incarico/work-task-summary.resolver';
import { UserLevelsService } from './services/settings/user-levels.service';
import { UserLevelsResolver } from './services/settings/user-levels.resolver';
import { HomeResolver } from './services/home/home.resolver';
import { HomeService } from './services/home/home.service';
import { TurnstileService } from './services/turnstile/turnstile.service';
import { TurnstileResolver } from './services/turnstile/turnstile.resolver';
import { TurnstileAttedanceService } from './services/turnstile/turnstile-attendance.service';
import { TurnstileAttendanceResolver } from './services/turnstile/turnstile-attendance.resolver';
import { CompareAttendanceAndWorkedHours } from './services/impiegato/compare-attendance-and-worked-hours.service';
import { ReportsResolver } from './services/reports/reports.resolver';
import { ReportsService } from './services/reports/reports.service';
import { GlobalConfigurationAreaResolver } from './services/settings/global-configuration-area.resolver';
import { GlobalConfigurationAreaService } from './services/settings/global-configuration-area.service';
import { GlobalConfigurationDetailsService } from './services/settings/global-configurations-details.service';
import { GlobalConfigurationDetailsResolver } from './services/settings/global-configurations-details.resolver';
import { MyExpenseReportsService } from './services/expenses/my-expense-report.service';
import { MyExpenseReportsResolver } from './services/expenses/my-expense-report.resolver';
import { MyExpenseReportsDetailsResolver } from './services/expenses/my-expense-report-details.resolver';
import { MyExpenseReportsDetailsService } from './services/expenses/my-expense-report-details.service';
import { UserExpenseReportsResolver } from './services/expenses/user-expense-report.resolver';
import { UserExpenseReportsService } from './services/expenses/user-expense-report.service';
import { UserExpenseReportsDetailsResolver } from './services/expenses/user-expense-report-details.resolver';
import { UserExpenseReportsDetailsService } from './services/expenses/user-expense-report-details.service';
import { TaskCompletionLocksService } from './services/reports/task-completion-locks.service';
import { TaskCompletionLocksResolver } from './services/reports/task-completion-locks.resolver';
import { BackendConfigService } from './services/configs/backend-config.service';
import { CompaniesResolver } from "./services/settings/companies.resolver";
import { CompaniesService } from "./services/settings/companies.service";
import { WorkTaskExpensesResolver } from "./services/incarico/work-task-expenses.resolver";
import { WorkTaskExpensesService } from "./services/incarico/work-task-expenses.service";
import { WorkTaskBudgetSummaryService } from "./services/incarico/work-task-budget-summary.service";

@NgModule({
    imports : [
        
    ],
    providers: [ 
                 RestDataSource, TicketDownloadService, AuthService, ResetAllServicesService,
                 AuthoritiesService, AuthoritiesResolver, ImpiegatoService,
                 AuthDetailsService, SuccessfullyLoginLogsService, SuccessfullyLoginLogsResolver,
                 FrontendLoggerService, IncaricoService, IncaricoResolver,
                 SediLavorativeService, SediLavorativeResolver, CheckAuthenticationService,
                 DettagliIncaricoService, DettagliIncaricoResolver, BackendUrlsService,
                 MyProfileService, MyProfileResolver, UserProfileInfoService, UserProfileInfoResolver,
                 EmployeeManagementService, EmployeeManagementResolver,
                 EmployeeService, EmployeeResolver, EmployeeTeamsService,
                 CompletedTaskOfDayService, CompletedTaskOfDayResolver,
                 TaskOfUserService, EmployeePaycheckService,
                 MyPaychecksService, PersonalDocumentsResolver,
                 EmployeePersonalDocumentService, MyPersonalDocumentService,
                 WorkTaskSummaryService, WorkTaskSummaryResolver,
                 UserLevelsResolver, UserLevelsService,
                 HomeResolver, HomeService,
                 TurnstileResolver, TurnstileService,
                 TurnstileAttedanceService, TurnstileAttendanceResolver,
                 CompareAttendanceAndWorkedHours,
                 ReportsResolver, ReportsService,
                 GlobalConfigurationAreaResolver, GlobalConfigurationAreaService,
                 GlobalConfigurationDetailsResolver, GlobalConfigurationDetailsService,
                 MyExpenseReportsService, MyExpenseReportsResolver,
                 MyExpenseReportsDetailsResolver, MyExpenseReportsDetailsService,
                 UserExpenseReportsResolver, UserExpenseReportsService,
                 UserExpenseReportsDetailsResolver, UserExpenseReportsDetailsService,
                 TaskCompletionLocksResolver, TaskCompletionLocksService,
                 CompaniesResolver, CompaniesService,
                 WorkTaskExpensesResolver, WorkTaskExpensesService,

                 WorkTaskBudgetSummaryService,

                 BackendConfigService
                 
                ]
})
export class ModelModule { }