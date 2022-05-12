import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, TemplateRef } from '@angular/core';
import { IsMobileService } from '../../../util/sizing/is-mobile-service.service';

declare const $: any;

@Component({
  selector: 'app-show-hide-area',
  templateUrl: './show-hide-area.component.html',
  styleUrls: ['./show-hide-area.component.scss']
})
export class ShowHideAreaComponent implements OnInit {

  @ViewChild("collapseArea", { static: true })
  collapseArea: ElementRef;

  @Input()
  size: string; //xs sm md lg xl

  @Input()
  collapseAreaContent: TemplateRef<any>;

  @Input()
  iconClass: string;
  
  iconClassInternal = 'fa fa-filter';
  areCollapsedAreas = false;
  selectedSize: string = 'sm';


  constructor(private isMobileService: IsMobileService) { }

  ngOnInit() {
    this.setSelectedSize();
    if(this.iconClass!=null){
      this.iconClassInternal = this.iconClass;
    }
  }


  collapseAreas(){
    $(this.collapseArea.nativeElement).collapse('hide');
    this.areCollapsedAreas = true;
  }
  uncollapseAreas(){
    $(this.collapseArea.nativeElement).collapse('show');
    this.areCollapsedAreas = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizingEnded();
  }

  resizingEnded(){
      if (!this.checkScreen()){ // if is desktop and filter are collapsed
        if ($(this.collapseArea.nativeElement) != null) {
          $(this.collapseArea.nativeElement).collapse('show');
          this.areCollapsedAreas = false;
        }
      }
  }


  checkScreen(): boolean{
    if(this.selectedSize=='xs'){
      return this.isMobileService.isLessThan_XS_Screen();
    }
    if(this.selectedSize=='md'){
      return this.isMobileService.isLessThan_MD_Screen();
    }
    if(this.selectedSize=='lg'){
      return this.isMobileService.isLessThan_LG_Screen();
    }
    if(this.selectedSize=='xl'){
      return this.isMobileService.isLessThan_XL_Screen();
    }
    return this.isMobileService.isLessThan_SM_Screen()
  }

  private setSelectedSize(): string {
    if(this.size=='xs'){
      this.selectedSize = 'xs';
      return this.selectedSize;
    }
    if(this.size=='md'){
      this.selectedSize = 'md';
      return this.selectedSize;
    }
    if(this.size=='lg'){
      this.selectedSize = 'lg';
      return this.selectedSize;
    }
    if(this.size=='xl'){
      this.selectedSize = 'xl';
      return this.selectedSize;
    }
    this.selectedSize = 'sm';

    return this.selectedSize;
  }

}
