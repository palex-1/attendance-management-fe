import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from '@ngx-translate/core';
import { CustomMessageComponent } from "./custom-message.component";
import { CustomMessageService } from "./custom-message.service";

@NgModule({
    imports: [BrowserModule, TranslateModule],

    declarations: [CustomMessageComponent],

    exports: [CustomMessageComponent],

    providers: [CustomMessageService]

})

export class CustomMessageModule { }