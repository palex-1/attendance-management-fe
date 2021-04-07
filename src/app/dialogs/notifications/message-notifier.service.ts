import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { NotificationMessage } from "./notification-message.model";


type Severities = 'success' | 'info' | 'warn' | 'error';

@Injectable()
export class MessageNotifierService {
    

    constructor( private translate: TranslateService){
        
    }


    notificationChange: Subject<NotificationMessage> = new Subject<NotificationMessage>();
    
    private showNotification(severity: string, title: string, mess: string, time ?: number) {
        this.notificationChange.next(
                    { 
                        severity: severity, 
                        title: title, 
                        detail: mess, 
                        time: time 
                    }
            );
    }


    notifyInfo(title: string, mess: string, time ?: number) {
        this.showNotification('info', title, mess, time);
    }

    notifySuccess(title: string, mess: string, time ?: number) {
        this.showNotification('success', title, mess, time);
    }

    notifyError(title: string, mess: string, time ?: number) {
        this.showNotification('error', title, mess, time);
    }

    notifyWarning(title: string, mess: string, time ?: number) {
        this.showNotification('warn', title, mess, time);
    }


    notifyInfoWithI18n(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.notifyInfo(title, MessageNotifierService.replacePlaceholderWithContent(mess, messageParams), time);
            });
        });
    }

    notifySuccessWithI18n(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.notifySuccess(title, MessageNotifierService.replacePlaceholderWithContent(mess, messageParams), time);
            });
        });
    }

    notifyErrorWithI18n(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.notifyError(title, MessageNotifierService.replacePlaceholderWithContent(mess, messageParams), time);
            });
        });
    }

    notifyWarningWithI18n(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.notifyWarning(title, MessageNotifierService.replacePlaceholderWithContent(mess, messageParams), time);
            });
        });
    }

    public static replacePlaceholderWithContent(input: string, messageParams: string[]): string{
        if(messageParams==null || messageParams.length<=0 || input==null){
            return input;
        }
        let park = input;
        for(let i=0; i<messageParams.length; i++){
            let placeholder = '{'+i+'}';
            park = park.replace(placeholder, messageParams[i]);
        }
        return park;
    }


    notifyInfoWithI18nAndStandardTitle(i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.notifyInfoWithI18n("message.info", i18nFileKeyForMessage, messageParams, time);
    }

    notifySuccessWithI18nAndStandardTitle(i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.notifySuccessWithI18n("message.success", i18nFileKeyForMessage, messageParams, time);
    }

    notifyErrorWithI18nAndStandardTitle(i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.notifyErrorWithI18n("message.error", i18nFileKeyForMessage, messageParams, time);
    }

    notifyWarningWithI18nAndStandardTitle(i18nFileKeyForMessage: string, messageParams: string[] = [], time ?: number) {
        this.notifyWarningWithI18n("message.warning", i18nFileKeyForMessage, messageParams, time);
    }


    notifyInfoWithStandardTitle(message: string, time ?: number) {
        this.translate.get("message.info").subscribe((title: string) => {
            this.notifyInfo(title, message, time);
        });
    }

    notifySuccessWithStandardTitle(message: string, time ?: number) {
        this.translate.get("message.success").subscribe((title: string) => {
            this.notifySuccess(title, message, time);
        });
    }

    notifyErrorWithStandardTitle(message: string, time ?: number) {
        this.translate.get("message.error").subscribe((title: string) => {
            this.notifyError(title, message, time);
        });
    }

    notifyWarningWithStandardTitle(message: string, time ?: number) {
        this.translate.get("message.warning").subscribe((title: string) => {
            this.notifyWarning(title, message, time);
        });
    }


    notifyInfoCustomTime(title: string, mess: string, time ?: number) {
        this.showNotification('info', title, mess, time);
    }

    notifySuccessCustomTime(title: string, mess: string, time ?: number) {
        this.showNotification('success', title, mess, time);
    }

    notifyErrorCustomTime(title: string, mess: string, time ?: number) {
        this.showNotification('error', title, mess, time);
    }

    notifyWarningCustomTime(title: string, mess: string, time ?: number) {
        this.showNotification('warn', title, mess, time);
    }

   

}