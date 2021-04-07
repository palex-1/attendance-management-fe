import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'monthTranslate'
})
export class MonthTranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService){

  }

  transform(value ?: number): unknown {
    if(value==null){
      return '';
    }
    switch(value){
      case 0:{
        return this.translate.instant("label.january");
      }
      case 1:{
        return this.translate.instant("label.february");
      }
      case 2:{
        return this.translate.instant("label.march");
      }
      case 3:{
        return this.translate.instant("label.april");
      }
      case 4:{
        return this.translate.instant("label.may-l");
      }
      case 5:{
        return this.translate.instant("label.june");
      }
      case 6:{
        return this.translate.instant("label.july");
      }
      case 7:{
        return this.translate.instant("label.august");
      }
      case 8:{
        return this.translate.instant("label.september");
      }
      case 9:{
        return this.translate.instant("label.october");
      }
      case 10:{
        return this.translate.instant("label.november");
      }
      case 11:{
        return this.translate.instant("label.december");
      }
    }

    return '';
  }

}
