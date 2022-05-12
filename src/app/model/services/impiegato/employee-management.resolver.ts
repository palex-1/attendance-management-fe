import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ResetableService } from "../resetable-service.model";
import { Observable } from "rxjs";
import { EmployeeManagementService } from "./employee-management.service";

@Injectable()
export class EmployeeManagementResolver extends AbstractResolver {

    constructor(private employeeManagementService: EmployeeManagementService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.employeeManagementService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.employeeManagementService.reset();
        
        return super.resolve(route, state);
    }

}