import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'taskCompletionLockStatusPipe'
})
export class TaskCompletionLockStatusPipe implements PipeTransform {

  constructor(private translate: TranslateService){

  }

  public static get ALL_STATUS(): string[] {
    return ['NOT_TO_BE_PROCESSED', 'TO_BE_PROCESSED', 'PROCESSING', 'PROCESSED'];
  }

  transform(value?: string): string {
    if(value==null){
      return '';
    }

    if(value=='NOT_TO_BE_PROCESSED'){
      return this.translate.instant("label.not-to-be-processed");
    }
    if(value=='TO_BE_PROCESSED'){
      return this.translate.instant("label.to-be-processed");
    }
    if(value=='PROCESSING'){
      return this.translate.instant("label.processing");
    }
    if(value=='PROCESSED'){
      return this.translate.instant("label.processed");
    }    

    return value;
  }

}
