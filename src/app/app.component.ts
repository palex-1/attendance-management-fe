import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  

  constructor(private translate : TranslateService){
  }

  ngOnInit(){
    this.translate.addLangs(['it']);
    let defaultLang = this.getLanguage(this.translate.getBrowserLang());
    this.translate.setDefaultLang( defaultLang );
    this.translate.use( defaultLang );
    
  }

  changeLang(lang: string) {
    let toSet = this.getLanguage(lang);
    this.translate.use(toSet);
  }

  /*
  * Restituisce la lingua da settare. Se si vuole estendere il metodo per supportare linguaggi multipli
  * inseriamo questa lingua nello switch e infine come default restituiamo inglese, cioè se la lingua
  * non è supportata ad esempio spagnolo restituiamo la pagina in inglese
  */
  private getLanguage(lang: string): string {
     if(lang == null){
       return 'it';
     }
     switch(lang){
        case 'it': {
          return 'it';
        }
        default : {
          return 'it';
        }
     }
  }



}
