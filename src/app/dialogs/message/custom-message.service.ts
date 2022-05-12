import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Subject } from 'rxjs';
import { MessageInfo } from './objects/message-info.model';


@Injectable()
export class CustomMessageService {

    massageChange: Subject<MessageInfo> = new Subject<MessageInfo>();

    constructor( private translate: TranslateService){

    }

    private confirmationRequest(title: string, mess: string){
        this.massageChange.next({ title: title, mess: mess });
    }



    showMessageBoxI18n(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string){
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.confirmationRequest(title, mess);
            });
        });
    }

    showMessageBoxI18nkWithParams(i18nFileKeyForTitle: string, i18nFileKeyForMessage: string, messageParams: string[]){
        this.translate.get(i18nFileKeyForTitle).subscribe((title: string) => {
            this.translate.get(i18nFileKeyForMessage).subscribe((mess: string) => {
                this.confirmationRequest(title, this.replacePlaceholderWithContent(mess, messageParams));
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


}