import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RuoloIncarico } from 'src/app/model/dtos/incarico/ruolo-incarico.model';


@Pipe({
  name: 'personalDocumentType'
})
export class DocumentTypeTranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService){

  }

  transform(value ?: any): any {
      if(value==null){
        return '';
      }

      switch (value){
        case 'PERSONAL_PHOTO': {
            return this.translate.instant('label.personal_photo');
        }
        case 'CLEAN_POLICE_CERTIFICATION': {
            return this.translate.instant('label.clean_police_certification');
        }
        case 'IDENTITY_CARD': {
            return this.translate.instant('label.identity_card');
        }
        case 'ADDRESS_SELF_CERTIFICATION': {
            return this.translate.instant('label.address_self_certification');
        }
        case 'FISCAL_CODE': {
            return this.translate.instant('label.fiscal_code');
        }
        case 'GDPR': {
            return this.translate.instant('label.gdpr');
        }
        case 'ETHICAL_CODE': {
            return this.translate.instant('label.ethical_code');
        }
        case 'EMPLOYMENT_CONTRACT': {
            return this.translate.instant('label.employment_contract');
        }
        case 'TFR_DEST': {
            return this.translate.instant('label.tfr-destination');
        }
    }

    return value;
  }
}
