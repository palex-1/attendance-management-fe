import { Injectable } from "@angular/core";
import { AbstractResolver } from "../abstract.resolver";
import { LoadingService } from "../../../dialogs/loading/loading.service";
import { ResetableService } from "../resetable-service.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { TurnstileService } from './turnstile.service';
import { TurnstileAttedanceService } from './turnstile-attendance.service';


@Injectable()
export class TurnstileAttendanceResolver extends AbstractResolver{

    constructor(private turnstileAttendanceSrv: TurnstileAttedanceService,
                    private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService{
        return this.loader;
    }

    getResetableService(): ResetableService{
        return this.turnstileAttendanceSrv;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.turnstileAttendanceSrv.reset();

        return super.resolve(route, state);
    }

}