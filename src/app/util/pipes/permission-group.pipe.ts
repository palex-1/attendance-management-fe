import { Pipe } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
    name: 'permissionGroupLabelPipe'
})
export class PermissionGroupLabelPipe{

    constructor(private translate: TranslateService){

    }
    

    transform(value: string): string{
        if(value==null){
            return '';
        }
        if(value=='LOGGED_USER'){
            return this.translate.instant("label.logged-user");
        }
        if(value=='STAGIST_EMPLOYEE'){
            return this.translate.instant("label.stagist-emaployee");
        }
        if(value=='JUNIOR_EMPLOYEE'){
            return this.translate.instant("label.junior-employee");
        }
        if(value=='SENIOR_EMPLOYEE'){
            return this.translate.instant("label.senior-employee");
        }
        if(value=='MANAGER'){
            return this.translate.instant("label.manager");
        }
        if(value=='HR_BUSINESS_PARTNER'){
            return this.translate.instant("label.hr-business-partner");
        }
        if(value=='ADMINISTRATION'){
            return this.translate.instant("label.administration");
        }

        return value;
    }
}