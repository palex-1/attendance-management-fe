import { Injectable } from "@angular/core";
import { RestDataSource } from "../../rest.datasource";
import { FeLoggingDTO } from "../../dtos/fe-logging-dto.model";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { BackendUrlsService } from "../../backend-urls.service";

const BASE_URL: string = "fe-logging";

@Injectable()
export class FrontendLoggerService {

    constructor(private datasource: RestDataSource, private backendUrlSrv: BackendUrlsService){
    }
    
    public logError(dto: FeLoggingDTO): Observable<any> {
        return this.datasource.makePostJsonObject<any>(this.backendUrlSrv.getLoggingPathError(), dto, new HttpParams(), new HttpHeaders(), true);
    }

    public logInfo(dto: FeLoggingDTO): Observable<any> {
        return this.datasource.makePostJsonObject<any>(
            this.backendUrlSrv.getLoggingPathInfo(), dto, new HttpParams(), new HttpHeaders(), true);
    }

    public logWarning(dto: FeLoggingDTO): Observable<any> {
        return this.datasource.makePostJsonObject<any>(this.backendUrlSrv.getLoggingPathWarn(), dto, new HttpParams(), new HttpHeaders(), true);
    }

    public logDebug(dto: FeLoggingDTO): Observable<any> {
        return this.datasource.makePostJsonObject<any>(
            this.backendUrlSrv.getLoggingPathDebug(), dto, new HttpParams(), new HttpHeaders(), true);
    }

}