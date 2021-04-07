import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainExceptionHandler } from './exceptions/chain-exception-handler.service';
import { SetLanguageService } from './language/set-language.service';
import { IsMobileService } from './sizing/is-mobile-service.service';
import { TranslationLoaderResolver } from './language/translation-loader.resolver';
import { NotificationsModule } from '../dialogs/notifications/notifications.module';
import { SPredicateBuilder } from './querying/s-predicate-builder.service';
import { TrueFalsePipe } from './pipes/true-false.pipe';
import { EllipsesDropperPipe } from './pipes/ellipses-dropper.pipe';
import { SessionLocalInterceptor } from './interceptors/session_local.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UnauthorizedInterceptor } from './interceptors/unauthorized.interceptor';
import { ShortDatePipe } from './pipes/short-date.pipe';
import { CustomTitleCasePipe } from './pipes/custom-title-case.pipe';
import { RuoloTeamTranslatePipe } from './pipes/ruolo-team-translate.pipe';
import { IdGenerationService } from './id-generation.service';
import { ServiceUnavailableInterceptor } from './interceptors/service-unavailable.interceptor';
import { MessageNotifierService } from '../dialogs/notifications/message-notifier.service';
import { ServiceUnavailableService } from '../dashboard/components/service-unavailable/service-unavailable.service';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { PermissionGroupLabelPipe } from './pipes/permission-group.pipe';
import { WorkDayTypePipe } from './pipes/work-day-type.pipe';
import { MonthTranslatePipe } from './pipes/month-translate.pipe';
import { DocumentTypeTranslatePipe } from './pipes/document-type.pipe';
import { AttendanceTypePipe } from './pipes/attendance-type.pipe';
import { TurnstileTypePipe } from './pipes/turnstile-type.pipe';
import { NumberToHoursAndMinutesPipe } from './pipes/number-to-hours-and-minutes.pipe';
import { FileUtilityService } from './file-utility.service';
import { ReportStatusPipe } from './pipes/report-status.pipe';
import { ExpenseReportStatusPipe } from './pipes/expense-report-status.pipe';
import { TaskCompletionLockStatusPipe } from './pipes/task-completion-lock-status.pipe';

@NgModule({
  imports: [
      CommonModule, NotificationsModule
  ],
  declarations: [
    DateFormatPipe, TrueFalsePipe, PermissionGroupLabelPipe,
    EllipsesDropperPipe, ShortDatePipe, CustomTitleCasePipe, RuoloTeamTranslatePipe, 
    WorkDayTypePipe, MonthTranslatePipe, DocumentTypeTranslatePipe, TurnstileTypePipe,
    AttendanceTypePipe, NumberToHoursAndMinutesPipe, ReportStatusPipe, ExpenseReportStatusPipe,
    TaskCompletionLockStatusPipe
  ],

  exports: [
     DateFormatPipe, TrueFalsePipe, PermissionGroupLabelPipe,
      EllipsesDropperPipe, ShortDatePipe, CustomTitleCasePipe, RuoloTeamTranslatePipe,
      WorkDayTypePipe, MonthTranslatePipe, DocumentTypeTranslatePipe, TurnstileTypePipe,
      AttendanceTypePipe, NumberToHoursAndMinutesPipe, ReportStatusPipe, ExpenseReportStatusPipe,
      TaskCompletionLockStatusPipe
  ],

  

  providers: [ 
      IsMobileService, TranslationLoaderResolver,
      SetLanguageService, ChainExceptionHandler,
      SPredicateBuilder, IdGenerationService,
      DateFormatPipe, PermissionGroupLabelPipe,
      FileUtilityService,

      SessionLocalInterceptor, UnauthorizedInterceptor, ServiceUnavailableInterceptor,

      { provide: HTTP_INTERCEPTORS, useClass: SessionLocalInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
      
      { provide: HTTP_INTERCEPTORS, useClass: ServiceUnavailableInterceptor, multi: true,
        deps: [MessageNotifierService,  ServiceUnavailableService]
        },

      
    ]
})
export class UtilsModule { }
