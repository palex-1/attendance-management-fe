import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { AbstractResolver } from '../abstract.resolver';
import { Injectable } from '@angular/core';
import { ResetableService } from '../resetable-service.model';
import { HomeService } from './home.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

@Injectable()
export class HomeResolver extends AbstractResolver {

    constructor(private homeService: HomeService, private loader: LoadingService){
        super();
    }

    getLoadingService(): LoadingService {
        return this.loader;
    }

    getResetableService(): ResetableService {
        return this.homeService;
    }

    override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        this.homeService.reset();

        return super.resolve(route, state);
    }

}