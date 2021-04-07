import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'attendanceType'
})
export class AttendanceTypePipe implements PipeTransform {

  
  public static get ALL_ATTENDANCE_TYPE(): string[]{
    return ['ENTER', 'EXIT'];
  }

  constructor(private translate: TranslateService){

  }

  transform(value ?: any): string{
    if(value==null){
      return '';
    }
    if(value=='ENTER'){
      return this.translate.instant("label.enter");
    }
    if(value=='EXIT'){
      return this.translate.instant("label.exit");
    }

    return value;
  }

}
