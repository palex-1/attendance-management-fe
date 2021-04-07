import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";


@Injectable()
export class TranslationLoaderResolver {

    constructor(private translate: TranslateService){
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>{
        return this.translate.get("last.dummy");
    }
    
}