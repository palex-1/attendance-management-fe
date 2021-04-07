import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from "@angular/router";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardModule } from "./dashboard/dashboard.module";

import { CustomConfirmationModule } from './dialogs/confirmation/custom-confirmation.module';
import { NotificationsModule } from './dialogs/notifications/notifications.module';
import { LoadingModule } from './dialogs/loading/loading.module';
import { ValidatorsModule } from './util/validators/validators.module';
import { ModelModule } from './model/model.module';
import { LoginStuffModule } from './loginstuff/login-stuff.module';
import { DirectiveModule } from './directives/directive.module';
import { ThemingModule } from './util/theming/theming.module';
import { UtilsModule } from './util/utils.module';

import {NgbModule, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n } from './util/language/datepicker-i18n';
import { NgbDateCustomParserFormatter } from './util/language/ngb-date-custom-parser-formatter.service';
import { CustomExceptionHandler } from './error/custom-exception-handler.service';
import { ComponentsModule } from './dashboard/components/components.module';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  
  imports: [CustomConfirmationModule, NotificationsModule, LoadingModule,
            BrowserModule, HttpClientModule, BrowserAnimationsModule, 
            DashboardModule, ValidatorsModule,
            ModelModule, LoginStuffModule, ThemingModule,  
            DirectiveModule, UtilsModule, ComponentsModule,

            NgbModule,
              TranslateModule.forRoot({
                loader: {
                            provide: TranslateLoader,
                            useFactory: (createTranslateLoader),
                            deps: [HttpClient]
                        }
              }),


               RouterModule.forRoot([
                    {path: "**", redirectTo: "/login"},

                    {
                      path: "dashboard",
                      loadChildren: "./dashboard/dashboard.module#DashboardModule"
                    }


                ], { useHash: true , onSameUrlNavigation: "reload"})
  ],
  providers: [ CustomDatepickerI18n, NgbDateCustomParserFormatter,
    {
      provide: NgbDatepickerI18n, 
      useClass: CustomDatepickerI18n},
    {
      provide: NgbDateParserFormatter, 
      useClass: NgbDateCustomParserFormatter},
    {
      provide: ErrorHandler, 
      useClass: CustomExceptionHandler
    }
  ],  
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }




