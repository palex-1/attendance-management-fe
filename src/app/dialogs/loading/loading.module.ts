import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from "./loading.service";
import { LoaderComponent } from "./loader.component";


@NgModule({
    imports: [BrowserModule, TranslateModule],

    declarations: [LoaderComponent],

    exports: [LoaderComponent],

    providers: [LoadingService]

})

export class LoadingModule { }