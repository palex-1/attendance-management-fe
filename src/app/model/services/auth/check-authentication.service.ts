import { Injectable } from "@angular/core";
import { RestDataSource } from "../../rest.datasource";
import { HttpParams } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { BooleanDTO } from "../../dtos/boolean-dto.model";
import { GenericResponse } from "../../dtos/generic-response.model";
import { BackendUrlsService } from "../../backend-urls.service";


@Injectable()
export class CheckAuthenticationService {

    constructor(private datasource: RestDataSource,
                    private backendUrlsSrv: BackendUrlsService){
    }

    checkIfImLoggedUser(): Observable<any>{
       return this.datasource.sendGetRequest<GenericResponse<BooleanDTO>>
        (this.backendUrlsSrv.getCheckAuthenticationUrl(), new HttpParams(), true).
            pipe(
                map(
                    (res: GenericResponse<BooleanDTO>) => {
                        if(res.data!=null && res.data.value==true){
                            return true;
                        }
                        return false;
                    }
                ),
                catchError( 
                    (err)=>{
                        return throwError(err); 
                })
            );
    }

}