import { Injectable } from "@angular/core";
import { RestDataSource } from "../../rest.datasource";
import { ChangeEmailRequestDTO } from "../../dtos/change-email-request-dto.model";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { BackendUrlsService } from "../../backend-urls.service";

const BASE_URL: string = "impiegato";

@Injectable()
export class ImpiegatoService{
    

    constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService){
    }

    completeEmailChange(authorization_token: string): any {
        let params: HttpParams = new HttpParams();
        params = params.append('authorization_token', authorization_token);
        
        return this.datasource.makePostJsonObject(this.backendUrlsSrv.getImpiegatoConfirmEmailUrl(), undefined, params, new HttpHeaders(), true);
    }


}