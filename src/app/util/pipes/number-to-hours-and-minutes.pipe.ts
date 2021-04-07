import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToHoursAndMinutes'
})
export class NumberToHoursAndMinutesPipe implements PipeTransform {

  transform(value: number): unknown {
    if(value==null){
      return '';
    }

    let hours: number = Math.floor(value)
    let minutes = value - hours;
    minutes = minutes * 60;
    //do not multiply minutes for 100 because are already 100
    let twoNumberAfterComma = Math.round(minutes);
    if(twoNumberAfterComma==60){
      hours = hours + 1;
      twoNumberAfterComma = 0;
    }
    let twoNumberAfterCommaStr = twoNumberAfterComma+'';

    if(twoNumberAfterComma<10){
      twoNumberAfterCommaStr = '0'+twoNumberAfterComma;
    }

    return hours+':'+twoNumberAfterCommaStr;
  }

}
