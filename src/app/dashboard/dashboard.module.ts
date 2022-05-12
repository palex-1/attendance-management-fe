import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from "./components/components.module";
import { DashboardComponent } from "./dashboard.component";
import { HomeComponent } from './home/home.component';
import { DashboardRoutingModule } from "./dashboard.routing";
import { CustomConfirmationModule } from '../dialogs/confirmation/custom-confirmation.module';
import { DatesModule } from '../util/dates/dates.module';

import { SettingsComponent } from './settings/settings.component';
import { AccessLogsComponent } from './access-logs/access-logs.component';
import { GuideComponent } from './guide/guide.component';
import { AccessDataComponent } from './access-data/access-data.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { DirectiveModule } from '../directives/directive.module';
import { PlannerGiornalieroComponent } from './planner-giornaliero/planner-giornaliero.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../util/utils.module';
import { GestioneCommesseComponent } from './gestione-commesse/gestione-commesse.component';
import { SediLavorativeComponent } from './sedi-lavorative/sedi-lavorative.component';
import { InfoCommessaComponent } from './gestione-commesse/info-commessa/info-commessa.component';
import { TeamCommessaComponent } from './gestione-commesse/team-commessa/team-commessa.component';
import { DettagliCommessaComponent } from './gestione-commesse/dettagli-commessa/dettagli-commessa.component';
import { AddTeamMemberModalComponent } from './gestione-commesse/add-team-member-modal/add-team-member-modal.component';
import { DocumentiPersonaliComponent } from './documenti-personali/documenti-personali.component';
import { GestioneDocumentiComponent } from './gestione-documenti/gestione-documenti.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { AddNewEmployeeComponent } from './employee-management/add-new-employee/add-new-employee.component';
import { EmployeeDetailsComponent } from './employee-management/employee-details/employee-details.component';
import { BasicEmployeeInfoComponent } from './employee-management/employee-details/basic-employee-info/basic-employee-info.component';
import { EmployeeTeamsComponent } from './employee-management/employee-details/employee-teams/employee-teams.component';
import { TaskOfUserModalComponent } from './planner-giornaliero/task-of-user-modal/task-of-user-modal.component';
import { EmployeePaycheckComponent } from './employee-management/employee-details/employee-paycheck/employee-paycheck.component';
import { MyPersonalDocumentsComponent } from './documenti-personali/my-personal-documents/my-personal-documents.component';
import { MyPaychecksComponent } from './documenti-personali/my-paychecks/my-paychecks.component';
import { EmployeePersonalDocumentComponent } from './employee-management/employee-details/employee-personal-document/employee-personal-document.component';
import { WorkTaskSummaryComponent } from './gestione-commesse/work-task-summary/work-task-summary.component';
import { WorkedHoursDetailsModalComponent } from './gestione-commesse/worked-hours-details-modal/worked-hours-details-modal.component';
import { UserLevelsComponent } from './user-levels/user-levels.component';
import { UserLevelModalComponent } from './user-levels/user-level-modal/user-level-modal.component';
import { CustomChartsModule } from './components/charts/custom-charts.module';
import { TurnstileComponent } from './turnstile/turnstile.component';
import { AddViewEditTurnstileModalComponent } from './turnstile/add-view-edit-turnstile-modal/add-view-edit-turnstile-modal.component';
import { TurnstileDetailsComponent } from './turnstile/turnstile-details/turnstile-details.component';
import { RegisterAttendanceModalComponent } from './turnstile/register-attendance-modal/register-attendance-modal.component';
import { EmployeeAttendancesInfoComponent } from './employee-management/employee-details/employee-attendances-info/employee-attendances-info.component';
import { MontlyReportsComponent } from './montly-reports/montly-reports.component';
import { SettingAddEditModalComponent } from './settings/setting-add-edit-modal/setting-add-edit-modal.component';
import { SettingAreaConfigsComponent } from './settings/setting-area-configs/setting-area-configs.component';
import { MyExpenseReportComponent } from './my-expense-report/my-expense-report.component';
import { MyExpenseReportDetailsComponent } from './my-expense-report/my-expense-report-details/my-expense-report-details.component';
import { UserExpenseReportComponent } from './user-expense-report/user-expense-report.component';
import { UserExpenseReportDetailsComponent } from './user-expense-report/user-expense-report-details/user-expense-report-details.component';
import { TaskCompletionLockComponent } from './task-completion-lock/task-completion-lock.component';
import { ShowHideSidebarService } from './showHideSidebar.service';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyModalComponent } from './companies/companies-modal/company-modal.component';
import { TurnstileTokenViewComponent } from './turnstile/turnstile-token-view/turnstile-token-view.component';
import { TurnstileTotemModalComponent } from './turnstile/turnstile-totem-modal/turnstile-totem-modal.component';
import { WorkTaskExpensesComponent } from './gestione-commesse/work-task-expenses/work-task-expenses.component';
import { AddWorkTaskExpenseModalComponent } from './gestione-commesse/add-work-task-expense-modal/add-work-task-expense-modal.component';
import { UpdateWorkTaskExpenseModalComponent } from './gestione-commesse/update-work-task-expense-modal/update-work-task-expense-modal.component';
import { ExportDailyAttendanceComponent } from './turnstile/export-daily-attendance/export-daily-attendance.component';
import { WorkTaskBudgetSummaryComponent } from './gestione-commesse/work-task-budget-summary/work-task-budget-summary.component';


@NgModule({
  imports: [ 
              CommonModule, FormsModule, ComponentsModule, 
              DashboardRoutingModule, RouterModule, TranslateModule, 
              CustomConfirmationModule, DatesModule, DirectiveModule,
              NgbModule, UtilsModule, CustomChartsModule
            ],
  providers: [
    ShowHideSidebarService
  ],
  declarations: [
                  DashboardComponent, HomeComponent, SettingsComponent,
                  GuideComponent, AccessDataComponent, PersonalInfoComponent, 
                  PlannerGiornalieroComponent, GestioneCommesseComponent, 
                  SediLavorativeComponent, InfoCommessaComponent, TeamCommessaComponent, 
                  AccessLogsComponent, DettagliCommessaComponent, AddTeamMemberModalComponent, 
                  DocumentiPersonaliComponent, GestioneDocumentiComponent, 
                  EmployeeManagementComponent, AddNewEmployeeComponent, 
                  EmployeeDetailsComponent, BasicEmployeeInfoComponent, EmployeeTeamsComponent, 
                  TaskOfUserModalComponent, EmployeePaycheckComponent, 
                  MyPersonalDocumentsComponent, MyPaychecksComponent, 
                  EmployeePersonalDocumentComponent, WorkTaskSummaryComponent, 
                  WorkedHoursDetailsModalComponent, UserLevelsComponent, 
                  UserLevelModalComponent, TurnstileComponent, AddViewEditTurnstileModalComponent, 
                  TurnstileDetailsComponent, RegisterAttendanceModalComponent, EmployeeAttendancesInfoComponent, 
                  MontlyReportsComponent, SettingAddEditModalComponent, SettingAreaConfigsComponent, 
                  MyExpenseReportComponent, MyExpenseReportDetailsComponent, UserExpenseReportComponent, 
                  UserExpenseReportDetailsComponent, TaskCompletionLockComponent,  
                  CompaniesComponent, CompanyModalComponent, TurnstileTokenViewComponent, TurnstileTotemModalComponent, WorkTaskExpensesComponent, AddWorkTaskExpenseModalComponent, UpdateWorkTaskExpenseModalComponent, ExportDailyAttendanceComponent, WorkTaskBudgetSummaryComponent
                ],
  bootstrap: [
                  DashboardComponent
             ]
})
export class DashboardModule { }


