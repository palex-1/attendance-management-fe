import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard.component";
import { SettingsComponent } from './settings/settings.component';
import { AccessLogsComponent } from './access-logs/access-logs.component';
import { GuideComponent } from './guide/guide.component';
import { AccessDataComponent } from './access-data/access-data.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PlannerGiornalieroComponent } from './planner-giornaliero/planner-giornaliero.component';
import { AuthoritiesResolver } from '../model/services/auth/authorities.resolver';
import { IsLoggedInGuard } from '../loginstuff/guards/isLoggedIn.guard';
import { HasAuthorityGuard } from '../loginstuff/guards/hasAuthority.guard';
import { TranslationLoaderResolver } from '../util/language/translation-loader.resolver';
import { SuccessfullyLoginLogsResolver } from '../model/services/auth/successfully-login-logs.resolver';
import { GestioneCommesseComponent } from './gestione-commesse/gestione-commesse.component';
import { IncaricoResolver } from '../model/services/incarico/incarico.resolver';
import { DettagliIncaricoResolver } from '../model/services/incarico/dettagli-incarico.resolver';
import { SediLavorativeComponent } from './sedi-lavorative/sedi-lavorative.component';
import { SediLavorativeResolver } from '../model/services/sede/sedi-lavorative.resolver';
import { HomeComponent } from './home/home.component';
import { InfoCommessaComponent } from './gestione-commesse/info-commessa/info-commessa.component';
import { DocumentiPersonaliComponent } from './documenti-personali/documenti-personali.component';
import { MyProfileResolver } from '../model/services/my-profile/my-profile.resolver';
import { UserProfileInfoResolver } from '../model/services/my-profile/user-profile-info.resolver';
import { EmployeeManagementResolver } from '../model/services/impiegato/employee-management.resolver';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { EmployeeDetailsComponent } from './employee-management/employee-details/employee-details.component';
import { EmployeeResolver } from '../model/services/impiegato/employee.resolver';
import { CompletedTaskOfDayResolver } from '../model/services/incarico/completed-task-of-day.resolver';
import { PersonalDocumentsResolver } from '../model/services/impiegato/personal-documents.resolver';
import { WorkTaskSummaryResolver } from '../model/services/incarico/work-task-summary.resolver';
import { UserLevelsComponent } from './user-levels/user-levels.component';
import { UserLevelsResolver } from '../model/services/settings/user-levels.resolver';
import { HomeResolver } from '../model/services/home/home.resolver';
import { TurnstileComponent } from './turnstile/turnstile.component';
import { TurnstileResolver } from '../model/services/turnstile/turnstile.resolver';
import { TurnstileDetailsComponent } from './turnstile/turnstile-details/turnstile-details.component';
import { TurnstileAttendanceResolver } from '../model/services/turnstile/turnstile-attendance.resolver';
import { ReportsResolver } from '../model/services/reports/reports.resolver';
import { MontlyReportsComponent } from './montly-reports/montly-reports.component';
import { GlobalConfigurationAreaResolver } from '../model/services/settings/global-configuration-area.resolver';
import { SettingAreaConfigsComponent } from './settings/setting-area-configs/setting-area-configs.component';
import { GlobalConfigurationDetailsResolver } from '../model/services/settings/global-configurations-details.resolver';
import { MyExpenseReportComponent } from './my-expense-report/my-expense-report.component';
import { MyExpenseReportsResolver } from '../model/services/expenses/my-expense-report.resolver';
import { MyExpenseReportDetailsComponent } from './my-expense-report/my-expense-report-details/my-expense-report-details.component';
import { MyExpenseReportsDetailsResolver } from '../model/services/expenses/my-expense-report-details.resolver';
import { UserExpenseReportComponent } from './user-expense-report/user-expense-report.component';
import { UserExpenseReportsResolver } from '../model/services/expenses/user-expense-report.resolver';
import { UserExpenseReportDetailsComponent } from './user-expense-report/user-expense-report-details/user-expense-report-details.component';
import { UserExpenseReportsDetailsResolver } from '../model/services/expenses/user-expense-report-details.resolver';
import { TaskCompletionLockComponent } from './task-completion-lock/task-completion-lock.component';
import { TaskCompletionLocksResolver } from '../model/services/reports/task-completion-locks.resolver';
import { CompaniesComponent } from './companies/companies.component';
import { CompaniesResolver } from '../model/services/settings/companies.resolver';

const routing = RouterModule.forChild([
    {path: "dashboard", component: DashboardComponent, resolve: {model: AuthoritiesResolver, TranslationLoaderResolver}, 
     canActivate: [IsLoggedInGuard], canActivateChild: [IsLoggedInGuard],
     children: [

        {path:'home', component: HomeComponent, pathMatch: 'full', canActivate: [HasAuthorityGuard], 
                resolve: {model: HomeResolver}, 
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}
        },

        {path: "settings/:area", component: SettingAreaConfigsComponent, canActivate: [HasAuthorityGuard],
                resolve: {model: GlobalConfigurationDetailsResolver}, 
                data: { auth: {authority: ['MANAGE_GLOBAL_CONFIGURATIONS']}}
        },

        {path: "settings", component: SettingsComponent, canActivate: [HasAuthorityGuard],
                resolve: {model: GlobalConfigurationAreaResolver}, 
                data: { auth: {authority: ['MANAGE_GLOBAL_CONFIGURATIONS']}}
        },

        {path: "companies", component: CompaniesComponent, canActivate: [HasAuthorityGuard],
                resolve: {model: CompaniesResolver}, 
                data: { auth: {authority: ['COMPANY_READ']}}
        },

        {path: "usersLevels", component: UserLevelsComponent, canActivate: [HasAuthorityGuard],
                resolve: {model: UserLevelsResolver}, 
                data: { auth: {authority: ['USER_LEVEL_READ']}}
        },

        {path: "accessLogs", component: AccessLogsComponent, resolve: {model: SuccessfullyLoginLogsResolver}, 
                canActivate: [HasAuthorityGuard], 
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}, 
        },

        {path: "taskManage", component: GestioneCommesseComponent, resolve: {model: IncaricoResolver}, 
                canActivate: [HasAuthorityGuard],  data: { auth: {authority: ['INCARICO_READ']}}, 
        },

        {path: "employeeManagement", component: EmployeeManagementComponent, resolve: {model: EmployeeManagementResolver}, 
                canActivate: [HasAuthorityGuard],  
                data: { 
                        auth: {authority: ['USER_PROFILE_READ']}
                }, 
        },

        {path: "employee/:idEmployee", component: EmployeeDetailsComponent, resolve: {model: EmployeeResolver},
                canActivate: [HasAuthorityGuard],  
                data: { 
                        auth: {authority: ['USER_PROFILE_READ']}
                }, 
        },


        {path: "taskManage/:taskId", component: InfoCommessaComponent, 
                resolve: { model: WorkTaskSummaryResolver, details: DettagliIncaricoResolver}, 
                canActivate: [HasAuthorityGuard],  
                data: { 
                        auth: {authority: ['INCARICO_READ']}
                }, 
        },
        

        {path: "documentiPersonali", component: DocumentiPersonaliComponent, resolve: {model: PersonalDocumentsResolver},
                canActivate: [HasAuthorityGuard], 
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}
        },

        {path: "sediLavorative", component: SediLavorativeComponent, resolve: {model: SuccessfullyLoginLogsResolver, SediLavorativeResolver },
                canActivate: [HasAuthorityGuard], data: { auth: {authority: ['SEDE_LAVORATIVA_READ']}}
        },

        {path: "guide", component: GuideComponent, canActivate: [HasAuthorityGuard], 
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}
        },

        {path: "accessData", component: AccessDataComponent, canActivate: [HasAuthorityGuard], resolve: {model: MyProfileResolver},
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}
        },

        {path: "personalInformation", component: PersonalInfoComponent, canActivate: [HasAuthorityGuard], resolve: {model: UserProfileInfoResolver},
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}} 
        },

        {path: "todayPlanner", component: PlannerGiornalieroComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: CompletedTaskOfDayResolver},
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}
        },

        {path: "turnstile", component: TurnstileComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: TurnstileResolver},
                data: { auth: {authority: ['TURNSTILE_READ']}}
        },

        {path: "turnstile/:turnstileId", component: TurnstileDetailsComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: TurnstileAttendanceResolver},
                data: { auth: {authority: ['USER_ATTENDANCE_READ', 'TURNSTILE_READ']}}
        },
        
        {path: "reports", component: MontlyReportsComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: ReportsResolver},
                data: { auth: {authority: ['REPORT_READ']}}
                
        },

        {path: "myExpenseReport", component: MyExpenseReportComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: MyExpenseReportsResolver},
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}
                
        },
        {path: "myExpenseReportDetails/:expenseReportId", component: MyExpenseReportDetailsComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: MyExpenseReportsDetailsResolver},
                data: { auth: {authority: ['LOGGED_USER_PERMISSION']}}
                
        },

        {path: "expenseReports", component: UserExpenseReportComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: UserExpenseReportsResolver},
                data: { auth: {authority: ['MANAGE_EXPENSE_REPORT']}}
                
        },
        
        {path: "expenseReportsDetails/:expenseReportId", component: UserExpenseReportDetailsComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: UserExpenseReportsDetailsResolver},
                data: { auth: {authority: ['MANAGE_EXPENSE_REPORT']}}
                
        },

        {path: "taskCompletionLock", component: TaskCompletionLockComponent, canActivate: [HasAuthorityGuard], 
                resolve: {model: TaskCompletionLocksResolver},
                data: { auth: {authority: ['TASK_COMPLETION_LOCK_READ']}}
                
        },
        
        {path: "**", redirectTo:'home'},

     ] 
    }
])


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    routing
  ],
  exports: [
  ],
})
export class DashboardRoutingModule { }