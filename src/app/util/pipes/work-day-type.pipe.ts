import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'workDayType'
})
export class WorkDayTypePipe implements PipeTransform {

  constructor(private translate: TranslateService){

  }

  transform(value?: string): string {
    if(value==null){
      return '';
    }
    if(value=='ROL'){
      return this.translate.instant("planner-giornaliero.permesso");
    }
    if(value=='FERIE'){
      return this.translate.instant("planner-giornaliero.ferie");
    }
    if(value=='MALATTIA'){
      return this.translate.instant("planner-giornaliero.malattia");
    }
    if(value=='FAMILY_DAY'){
      return this.translate.instant("label.family-day");
    }
    if(value=='PERMESSO_STUDIO'){
      return this.translate.instant("planner-giornaliero.permesso-ferie-studio");
    }
    if(value=='PERMESSO_DONAZIONE_SANGUE'){
      return this.translate.instant("planner-giornaliero.permesso-donazione-sangue");
    }
    if(value=='PERMESSO_LUTTO_FAMILIARE'){
      return this.translate.instant("planner-giornaliero.permesso-lutto-familiare");
    }
    if(value=='PERMESSO_MATRIMONIALE'){
      return this.translate.instant("planner-giornaliero.permesso-matrimoniale");
    }
    if(value=='CONGEDO_PATERNITA'){
      return this.translate.instant("planner-giornaliero.congedo-paternita");
    }
    if(value=='CONGEDO_MATERNITA'){
      return this.translate.instant("planner-giornaliero.congedo-maternita");
    }

    return value;
  }

}
