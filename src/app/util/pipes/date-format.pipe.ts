import { Pipe, PipeTransform } from '@angular/core';

const SIZE_DATE_LONG_FORMAT: number = 19;
const SIZE_SHORT_FORMAT: number = 10;

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value ?: any, type ?: any): string{
    if(value==null){
      return '';
    }
    let park: string = value+"";
    if(park.trim()==''){
      return '';
    }
    let date: Date = new Date(park);
    date.setMonth(date.getMonth())

    if(type=='short'){
      return this.stringOfDate(date);
    }
    if(type=='long'){
      return this.stringOfDateTime(date);
    }
    if(type=='timestamp'){
      return this.stringOfTimstamp(date);
    }

    return this.stringOfTimstamp(date);
  }


  private stringOfDate(date: Date): string{
    let dateString = ('0' + date.getDate()).slice(-2) + '/'
             + ('0' + (date.getMonth()+1)).slice(-2) + '/'
             + date.getFullYear();
    return dateString; 
  }

  private stringOfDateTime(date: Date){
    let dateString = this.stringOfDate(date);

    let dateTime = ('0' + date.getHours()).slice(-2) + ':'
      + ('0' + (date.getMinutes())).slice(-2);

    return dateString+" "+dateTime;
  }

  private stringOfTimstamp(date: Date){
    let dateString = this.stringOfDate(date);

    let dateTime = ('0' + date.getHours()).slice(-2) + ':'
      + ('0' + (date.getMinutes())).slice(-2) + ':'
      + ('0' + (date.getSeconds())).slice(-2);

    return dateString+" "+dateTime;
  }

}
