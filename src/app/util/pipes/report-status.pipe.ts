import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'reportStatusPipe'
})
export class ReportStatusPipe implements PipeTransform {

  constructor(private translate: TranslateService){

  }

  transform(value?: string): string {
    if(value==null){
      return '';
    }
    if(value=='TODO'){
      return this.translate.instant("label.todo");
    }
    if(value=='IN_PROGRESS'){
      return this.translate.instant("label.in-progress");
    }
    if(value=='COMPLETED'){
      return this.translate.instant("label.completed");
    }
    if(value=='ERROR'){
      return this.translate.instant("label.error");
    }    

    return value;
  }

}
