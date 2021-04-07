import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value==null){
      return '';
    }
    let park: string = value+"";
    let date: Date = new Date(park);
    let dateString = this.stringOfDate(date);

    return dateString;
  }

  private stringOfDate(date: Date): string{
    let dateString = ('0' + date.getDate()).slice(-2) + '/'
             + ('0' + (date.getMonth()+1)).slice(-2) + '/'
             + date.getFullYear();
    return dateString; 
  }

}
