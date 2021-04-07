import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { LoginComponent } from "./login/login.component";


import { ValidatorsModule } from "../util/validators/validators.module";
import { PswResetComponent } from "./psw-reset/psw-reset.component";
import { PswRecoveryComponent } from "./psw-recovery/psw-recovery.component";
import { IsLoggedInGuard } from "./guards/isLoggedIn.guard";
import { HasAuthorityGuard } from "./guards/hasAuthority.guard";
import { TranslationLoaderResolver } from "../util/language/translation-loader.resolver";
import { EmailChangeComponent } from './email-change/email-change.component';
import { ForcedToChangePasswordComponent } from './forced-to-change-password/forced-to-change-password.component';
import { IsForcedToChangePasswordGuard } from "./guards/is-forced-to-change-password.guard";
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { IsTwoFaInProgressGuard } from "./guards/is-two-fa-in-progress.guard";
import { HasAnyAuthorityGuard } from './guards/has-any-authority.guard';
import { ModelModule } from '../model/model.module';

let routing = RouterModule.forChild([
    {path: "login", component: LoginComponent, 
            resolve: {model: TranslationLoaderResolver}},
    
    {path: "password_reset/:token", component: PswResetComponent, 
            resolve: {model: TranslationLoaderResolver}},
   
    {path: "forgotPassword", component: PswRecoveryComponent, 
            resolve: {model: TranslationLoaderResolver}},
    
    {path: "email_change/:token", component: EmailChangeComponent, 
            resolve: {model: TranslationLoaderResolver}},

    {path: "force_password_change", component: ForcedToChangePasswordComponent, 
            resolve: {model: TranslationLoaderResolver}, canActivate: [IsForcedToChangePasswordGuard],
    },
    {path: "two_factor_authentication", component: TwoFactorAuthComponent, 
            resolve: {model: TranslationLoaderResolver}, canActivate: [IsTwoFaInProgressGuard],
    }
])



@NgModule({
    imports: [
        BrowserModule, 
        FormsModule, 
        TranslateModule, 
        ReactiveFormsModule, 
        ValidatorsModule, 
        routing,
        ModelModule
    ],
    declarations: [
        LoginComponent, PswResetComponent, 
        PswRecoveryComponent, EmailChangeComponent, 
        ForcedToChangePasswordComponent, TwoFactorAuthComponent 
    ],
    exports: [],
    providers: [
        IsLoggedInGuard, HasAuthorityGuard,
        IsForcedToChangePasswordGuard, IsTwoFaInProgressGuard,
        HasAnyAuthorityGuard
    ]

})
export class LoginStuffModule { }