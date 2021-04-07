import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

const LANG_SESS_STRING_MAP: string = "language_choosen_450485";

@Injectable()
export class SetLanguageService {

    constructor(private translate: TranslateService){
        this.inizializeLanguage();
    }

    inizializeLanguage(): void{
        if( this.getSessionCurrentLanguage()==null || this.getSessionCurrentLanguage()=="null" ){
            this.setBrowserLanguage();
        }else{
            this.changeLang(this.getSessionCurrentLanguage())
        }
    }

    private setBrowserLanguage(): void{
        this.translate.addLangs(['it'/*, 'en'*/]);
        let defaultLang = this.getLanguage(this.translate.getBrowserLang());
        this.translate.setDefaultLang( defaultLang );
        //console.log(defaultLang);
        this.translate.use( defaultLang );
    }

    saveSessionCurrentLanguage(lang: string): void{
        localStorage.setItem(LANG_SESS_STRING_MAP, lang);
    }

    getSessionCurrentLanguage(): string{
        return localStorage.getItem(LANG_SESS_STRING_MAP);
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
        /*case 'en' :{
            return 'en';
        }*/
        default : {
            return 'it';
        }
        }
    }


    changeLang(lang: string) {
        this.translate.langs=[];
    this.translate.addLangs(['it'/*, 'en'*/]);
        let toSet = this.getLanguage(lang);
        this.saveSessionCurrentLanguage(toSet);
        this.translate.use(toSet);
    }
    
}
