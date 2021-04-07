import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationRequest } from './objects/confirmation-request.model';
import { Subject } from 'rxjs';


@Injectable()
export class CustomConfirmationService {

    confirmationChange: Subject<ConfirmationRequest> = new Subject<ConfirmationRequest>();

    constructor( private translate: TranslateService){

    }

    
    private confirmationRequest(title: string, mess: string,  confirmationCallback: () => any, rejectCallback: () => any){
        this.confirmationChange.next({ title: title, mess: mess, confirmationCallback: confirmationCallback , rejectCallback: rejectCallback});
    }



    askConfirmationWithStandardTitle(mess: string, confirmationCallback: () => any, rejectCallback: () => any){
        this.translate.get("generic.title-for-confirmation").subscribe((title: string) => {
            this.confirmationRequest(title, mess, confirmationCallback, rejectCallback);
        });
    }


    askConfirmation(title: string, mess: string, confirmationCallback: () => any, rejectCallback: () => any){
        this.confirmationRequest(title, mess, confirmationCallback, rejectCallback);
    }


    askConfirmationWithStandardTitleI18n(i18nFileKeyForMessage: string, confirmationCallback: () => any, rejectCallback: () => any){
        this.translate.get("generic.title-for-confirmation").subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.confirmationRequest(title, mess, confirmationCallback, rejectCallback);
            });
        });
    }


    askConfirmationI18n(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string, confirmationCallback: () => any, rejectCallback: () => any){
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.confirmationRequest(title, mess, confirmationCallback, rejectCallback);
            });
        });
    }



    askConfirmationWithStandardTitleNoRejectCallback(mess: string, confirmationCallback: () => any){
        this.translate.get("generic.title-for-confirmation").subscribe((title: string) => {
            this.confirmationRequest(title, mess, confirmationCallback, () => {} );
        });
    }


    askConfirmationNoRejectCallback(title: string, mess: string, confirmationCallback: () => any){
        this.confirmationRequest(title, mess, confirmationCallback, () =>{});
    }


    askConfirmationWithStandardTitleI18nNoRejectCallback(i18nFileKeyForMessage: string, confirmationCallback: () => any){
        this.translate.get("generic.title-for-confirmation").subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.confirmationRequest(title, mess, confirmationCallback, () => {});
            });
        });
    }


    askConfirmationWithStandardTitleI18nNoRejectCallbackWithParams(i18nFileKeyForMessage: string, confirmationCallback: () => any, messageParams: string[]){
        this.translate.get("generic.title-for-confirmation").subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.confirmationRequest(title, this.replacePlaceholderWithContent(mess, messageParams), confirmationCallback, () => {});
            });
        });
    }

    private replacePlaceholderWithContent(input: string, messageParams: string[]): string{
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

    askConfirmationI18nNoRejectCallback(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string, confirmationCallback: () => any){
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.confirmationRequest(title, mess, confirmationCallback, () => {});
            });
        });
    }


}