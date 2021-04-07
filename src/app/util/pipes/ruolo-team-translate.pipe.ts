import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RuoloIncarico } from 'src/app/model/dtos/incarico/ruolo-incarico.model';


@Pipe({
  name: 'ruoloTeamTranslate'
})
export class RuoloTeamTranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService){

  }

  transform(value: any, args?: any): any {
      if(value==null){
        return '';
      }

      switch (value){
        case RuoloIncarico.PROJECT_MANAGER: {
            return this.translate.instant('ruolo-team.project_manager');
        }
        case RuoloIncarico.DELIVERY_MANAGER: {
          return this.translate.instant('ruolo-team.delivery_manager');
        }
        case RuoloIncarico.ACCOUNT_MANAGER: {
          return this.translate.instant('ruolo-team.account_manager');
        }
        case RuoloIncarico.QA_REVIEWER: {
          return this.translate.instant('ruolo-team.qa_reviewer');
        }
        case RuoloIncarico.RUOLO_GENERICO: {
          return this.translate.instant('ruolo-team.ruolo_generico');
        }
    }

    return value;
  }

  public static getAllTeamRole(): string[] {
    return [RuoloIncarico.PROJECT_MANAGER, RuoloIncarico.ACCOUNT_MANAGER, RuoloIncarico.DELIVERY_MANAGER,
      RuoloIncarico.QA_REVIEWER, RuoloIncarico.RUOLO_GENERICO];
  }

}
