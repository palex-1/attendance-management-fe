import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'turnstileType'
})
export class TurnstileTypePipe implements PipeTransform {

  
  public static get ALL_TURNSTILE_TYPE(): string[]{
    return ['VIRTUAL', 'PHYSICAL'];
  }

  constructor(private translate: TranslateService){

  }

  transform(value ?: any): string{
    if(value==null){
      return '';
    }
    if(value=='VIRTUAL'){
      return this.translate.instant("label.virtual");
    }
    if(value=='PHYSICAL'){
      return this.translate.instant("label.physical");
    }

    return value;
  }

}
