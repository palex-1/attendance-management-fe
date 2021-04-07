import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from '@ngx-translate/core';

import { NotificationsComponent } from "./notifications.component";
import { MessageNotifierService } from "./message-notifier.service";
import { NotificationComponent } from "./notification/notification.component";


@NgModule({
    imports: [BrowserModule, TranslateModule],

    declarations: [NotificationsComponent, NotificationComponent],

    exports: [NotificationsComponent, NotificationComponent],
    
    entryComponents: [
        NotificationsComponent,
        NotificationComponent
      ],

    providers: [MessageNotifierService]

})

export class NotificationsModule { }