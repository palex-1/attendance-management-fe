import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from 'src/app/model/services/auth/auth.service';
import { ResetAllServicesService } from 'src/app/model/services/reset-all-services.service';
import { ShowHideSidebarService } from '../../showHideSidebar.service';


@Component({
  selector: 'app-navbar-placeholder',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {

  constructor(private showHideSidebarService : ShowHideSidebarService,
                private auth: AuthService, private router: Router, private resetAllServicesSrv: ResetAllServicesService) { 

  }


  ngOnInit() {
  }


  hideOrShowSidebar(){
    let currentStatus : boolean = this.showHideSidebarService.getCurrentStatusAsBoolean();
    if(currentStatus==true){//is showed
      this.showHideSidebarService.hideSidebar();
    }else{//is hidden
      this.showHideSidebarService.showSidebar();
    }
  }

  executeLogout(): void{
    this.auth.logout();
    this.resetAllServicesSrv.resetAllServices();
    this.router.navigateByUrl("/login"); 
  }


}
