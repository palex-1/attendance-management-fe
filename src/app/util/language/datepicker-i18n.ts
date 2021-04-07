import { Injectable} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

const I18N_VALUES = {
  'it': {
    weekdays: ['Lu', 'Ma', 'Me', 'Gio', 'Ve', 'Sa', 'Do'],
    months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Aug', 'Sett', 'Ott', 'Nov', 'Dic'],
  },
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  },
  'en': {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
  // other languages you would support
};

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private translate: TranslateService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.currentLanguage].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this.currentLanguage].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    if(this.currentLanguage=='it'){
        return `${date.day}-${date.month}-${date.year}`;
      }
      return `${date.year}-${date.month}-${date.day}`;
  }

  get currentLanguage(): string{
      if(this.translate==null || this.translate.currentLang==null){
          return 'en';
      }
      return this.translate.currentLang;
  }
}