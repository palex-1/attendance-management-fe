import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-custom-collapse',
  templateUrl: './custom-collapse.component.html',
  styleUrls: ['./custom-collapse.component.scss']
})
export class CustomCollapseComponent implements OnInit {

  @ViewChild("collapseArea", { static: true })
  collapseArea: ElementRef;
  
  @Input()
  collapseAreaContent: TemplateRef<any>;
  
  @Input()
  title: string;

  @Input()
  initialCollapse: boolean;
  
  areCollapsedAreas = false;
  private removeDnoneAtFirstUncollapse = false;

  private collapsingOperationInProgress: boolean = false;

  constructor() { }

  ngOnInit() {
    if(this.initialCollapse+''==true+''){
     $(this.collapseArea.nativeElement).collapse('hide');
     this.collapseArea.nativeElement.classList.add('d-none')
     this.areCollapsedAreas = true;
     this.removeDnoneAtFirstUncollapse = true;
    }
  }



  collapseAreas(){
    if(this.collapsingOperationInProgress){
      return;
    }
    this.collapsingOperationInProgress = true;

    $(this.collapseArea.nativeElement).collapse('hide');
    this.areCollapsedAreas = true;

    this.deferCollapse();
  }

  uncollapseAreas(){
    if(this.collapsingOperationInProgress){
      return;
    }
    this.collapsingOperationInProgress = true;

    if(this.removeDnoneAtFirstUncollapse){
      this.collapseArea.nativeElement.classList.remove('d-none');
      this.removeDnoneAtFirstUncollapse = false;
    }

    $(this.collapseArea.nativeElement).collapse('show');

    this.areCollapsedAreas = false;

    this.deferCollapse();
  }
  
  deferCollapse(){
    let that = this;
    setTimeout(()=>{
      that.collapsingOperationInProgress = false;
    }, 200)
  }

}
