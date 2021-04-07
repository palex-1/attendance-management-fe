import { Injectable } from "@angular/core";

@Injectable()
export class IsMobileService{

    constructor(){

    }

    isMobile(): boolean {
        if (window.innerWidth > 767) {
            return false;
        }
        return true;
    }

    is_XS_Screen(): boolean{
        if(window.innerWidth < 576){
            return true;
        }
        return false;
    }

    isLessThan_XS_Screen(): boolean{
        if(window.innerWidth < 576){
            return true;
        }
        return false;
    }

    is_SM_Screen(): boolean {
        if (window.innerWidth >= 576 && window.innerWidth < 768) {
            return true;
        }
        return false;
    }

    isLessThan_SM_Screen(): boolean {
        if( window.innerWidth < 768){
            return true;
        }
        return false;
    }


    is_MD_Screen(): boolean {
        if (window.innerWidth > 767 && window.innerWidth < 992) {
            return true;
        }
        return false;
    }

    isLessThan_MD_Screen(): boolean {
        if (window.innerWidth < 768) {
            return true;
        }
        return false;
    }

    is_LG_Screen(){
        if (window.innerWidth > 992 && window.innerWidth < 1200) {
            return true;
        }
        return false;
    }

    isLessThan_LG_Screen(): boolean {
        if (window.innerWidth < 992) {
            return true;
        }
        return false;
    }
    
    is_XL_Screen(): boolean {
        if (window.innerWidth >= 1200) {
            return true;
        }
        return false;
    }
    isLessThan_XL_Screen(): boolean{
        if (window.innerWidth > 1199) {
            return false;
        }
        return true;
    }

}