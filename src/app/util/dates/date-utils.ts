import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class DateUtils {

    public static buildDateFromStrOrDate(date: any): Date{
        if(date==null || date==undefined){
            return null;
        }
        return new Date(date);
    }

    public static buildStartOfDayOfDate(date: Date){
        if(date==null || date==undefined){
            return null;
        }
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 1));
    }

    public static buildEndOfDayOfDate(date: Date){
        if(date==null || date==undefined){
            return null;
        }
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 99));
    }

    public static buildUTCDate(){
        let date = new Date();

        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 1));
    }

    public static buildUTCDateWithSeconds(){
        let date = new Date();

        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 1));
    }

    public static buildUTCDateWithSecondsFromDate(date: Date){
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 
                                date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
    }
}