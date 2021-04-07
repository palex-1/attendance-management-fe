import {  Injectable } from '@angular/core';

const SIZE_DATE_LONG_FORMAT: number = 19;
const SIZE_SHORT_FORMAT: number = 10;


@Injectable()
export class DateUTCToLocalService{

  constructor(){

  }

  transform(value: any): string{
    let park: string = value+"";
    
    if(park.length==SIZE_DATE_LONG_FORMAT){
      let date: Date = this.parseDateDDMMYYYYHHmmssWithSeparator(park);
      //add offset to local date
      date = new Date(date.getTime() + date.getTimezoneOffset() * 60000 * -1);
      return this.stringOfTimstamp(date);
    }
    if(park.length==SIZE_SHORT_FORMAT){
      let date: Date = this.parseDateDDMMYYYYWithSeparator(park);
      date = new Date(date.getTime() + date.getTimezoneOffset() * 60000 * -1);
      return this.stringOfDate(date);
    }


    return park;
  }


  private parseDateDDMMYYYYWithSeparator(toParse: string): Date{
    let year: number = Number.parseInt(toParse.substring(0,4));
    let month: number = Number.parseInt(toParse.substring(5,7)) -1;
    let day: number = Number.parseInt(toParse.substring(8,10));
    
    return new Date(year, month, day);
  }


  private parseDateDDMMYYYYHHmmssWithSeparator(toParse: string): Date{
    let year: number = Number.parseInt(toParse.substring(0,4));
    let month: number = Number.parseInt(toParse.substring(5,7)) -1;
    let day: number = Number.parseInt(toParse.substring(8,10));

    let hour: number = Number.parseInt(toParse.substring(11,13));
    let minute: number = Number.parseInt(toParse.substring(14,16));
    let second: number = Number.parseInt(toParse.substring(17,19));

    let parkDate: Date = new Date(year, month, day, hour, minute, second);
    

    return new Date(year, month, day, hour, minute, second);
  }


  private stringOfDate(date: Date): string{
    let dateString = ('0' + date.getDate()).slice(-2) + '/'
             + ('0' + (date.getMonth()+1)).slice(-2) + '/'
             + date.getFullYear();
    return dateString; 
  }

  private stringOfTimstamp(date: Date){
    let dateString = this.stringOfDate(date);

    let dateTime = ('0' + date.getHours()).slice(-2) + ':'
      + ('0' + (date.getMinutes())).slice(-2) + ':'
      + ('0' + (date.getSeconds())).slice(-2);

    return dateString+" "+dateTime;
  }

}