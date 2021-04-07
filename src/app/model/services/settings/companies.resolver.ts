import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResetableService } from "../resetable-service.model";
import { Observable } from "rxjs";
import { CompaniesService } from "./companies.service";

@Injectable()
export class CompaniesResolver extends AbstractResolver {

    constructor(private companiesService: CompaniesService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService {
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.companiesService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.companiesService.reset();

        return super.resolve(route, state)
    }

}