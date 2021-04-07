import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * @author Alessandro Pagliaro
 * 
 */
@Injectable()
export class BackgroundThemingService {


    constructor(){
    }

    setStandardColouredBackground(): void{
        document.body.style.background = '#9f9f9f';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
    }

    setWhiteBackground(): void{
        document.body.style.background = "white";
        document.body.style.width = '100%';
        document.body.style.height = '100%';
    }

    setDashboardBackground(): void {
        document.body.style.background = "#f8f9fc";
        document.body.style.width = '100%';
        document.body.style.height = '100%';
    }

}