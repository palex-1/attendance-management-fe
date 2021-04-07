import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";


import { IsMobileService } from 'src/app/util/sizing/is-mobile-service.service';
import { AuthService } from 'src/app/model/services/auth/auth.service';
import { ResetAllServicesService } from 'src/app/model/services/reset-all-services.service';
import { AuthoritiesService } from '../../../model/services/auth/authorities.service';
import { JwtHelper } from 'src/app/util/jwt-helper.model';
import { ShowHideSidebarService } from '../../showHideSidebar.service';

declare const $: any;


@Component({
  host: {
    '(document:click)': 'onClick($event)',
  },
  selector: 'app-sidebar-placeholder',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  jwtHelper: JwtHelper = new JwtHelper();

  @ViewChild('wrapper', { static: true }) 
  wrapper: ElementRef;

  @ViewChild('myModal', { static: false }) 
  modalBlack: ElementRef;

  private myModal: any;
  blockContent: boolean = false;
  private wrapperClass = "toggled";
  private id: any;


  constructor(private showHideService: ShowHideSidebarService, private translate: TranslateService,
                private auth: AuthService, private router: Router, private isMobileService: IsMobileService,
                  private resetAllServicesSrv: ResetAllServicesService, private authoritiesService: AuthoritiesService,
                    private renderer: Renderer2) {

  }

  ngOnInit() {
    this.showHideService.getStatus()
    .subscribe(show => { 
      this.showOrHideSidebar(show) 
    });
    
    if (this.isMobileService.isLessThan_LG_Screen()) {//if is desktop
      this.showHideService.hideSidebar();
    } else {
      this.showHideService.showSidebar();
    }
  }


  get username(): string {
    if(this.auth.username==null){
      return '';
    }
    return this.auth.username;
  }

  get permissionGroup(): string {
    if(this.auth.permissionGroup==null){
      return '';
    }
    return this.auth.permissionGroup;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //every click check if the sidebar is show in desktop version
    if (!this.isMobileService.isLessThan_LG_Screen()) {//if is desktop
      this.showHideService.showSidebar();
    } else {
      this.showHideService.hideSidebar();
    }
  }


  onClick(event) {
    //refresh every time myModal cause it change
    if(this.modalBlack!=null){
      const clickedInside = this.modalBlack.nativeElement.contains(event.target);
      if (clickedInside) {
        this.unlockContentPage();
      }
    }

  }

  handleButtonClickedOnSidebar(): void {
    if (this.isMobileService.isLessThan_LG_Screen()) {
      this.showHideService.hideSidebar();
    }
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }


  private showOrHideSidebar(show: boolean): void {
    if (show == false) {
      this.hideToolbar();
    } else {
      this.showToolbar();
    }
  }

  unlockContentPage(): void {
    if (this.isMobileService.isLessThan_LG_Screen()) {
      this.showHideService.hideSidebar();
    }
    this.blockContent = false;
  }

  getWrapperClass(): string {
    return this.wrapperClass;
  }

  showToolbar(): void {
    if (this.isMobileService.isLessThan_LG_Screen()) {
      this.blockContent = true;
    }else{
      this.blockContent = false;
    }
    this.renderer.addClass(this.wrapper.nativeElement, "toggled")
  }

  hideToolbar(): void {
    this.renderer.removeClass(this.wrapper.nativeElement, "toggled")
    this.blockContent = false;
  }


  executeLogout(): void {
    this.auth.logout();
    this.resetAllServicesSrv.resetAllServices();
    this.router.navigateByUrl("/login");
  }


}