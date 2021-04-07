import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CustomConfirmationComponent } from "./custom-confirmation.component";
import { CustomConfirmationService } from "./custom-confirmation.service";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [BrowserModule, TranslateModule],

    declarations: [CustomConfirmationComponent],

    exports: [CustomConfirmationComponent],

    providers: [CustomConfirmationService]

})

export class CustomConfirmationModule { }