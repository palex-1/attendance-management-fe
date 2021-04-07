import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'expenseReportStatusPipe'
})
export class ExpenseReportStatusPipe implements PipeTransform {

  public static get ALL_STATUSES(): string[] {
    return ['ACCEPTED', 'PARTIALLY_ACCEPTED', 'REFUSED', 'PROCESSING', 'TO_BE_PROCESSED'];
  }

  constructor(private translate: TranslateService){

  }

  transform(value?: string): string {
    if(value==null){
      return '';
    }
    
    if(value=='ACCEPTED'){
      return this.translate.instant("label.accepted");
    }
    if(value=='REFUSED'){
      return this.translate.instant("label.refused");
    }
    if(value=='PROCESSING'){
      return this.translate.instant("label.processing");
    }
    if(value=='TO_BE_PROCESSED'){
      return this.translate.instant("label.to-be-processed");
    }    
    if(value=='PARTIALLY_ACCEPTED'){
      return this.translate.instant("label.partially-accepted");
    }   
    return value;
  }

}
