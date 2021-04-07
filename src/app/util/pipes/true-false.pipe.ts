import { Pipe } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
    name: 'trueFalsePipe'
})
export class TrueFalsePipe{

    constructor(private translate: TranslateService){

    }

    transform(value: boolean): string{
        if(value==null){
            return '';
        }
        if(value==true){
            return this.translate.instant("generic.true");
        }
        if(value==false){
            return this.translate.instant("generic.false");
        }
    }
}