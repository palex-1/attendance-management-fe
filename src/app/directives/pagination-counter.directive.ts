import { Directive, Input, OnInit, Renderer2, ElementRef, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[pagination-counter]'
})
export class PaginationCounterDirective  implements OnInit, OnChanges {

  @Input("currentPageSize") public currentPageSize: number;
  @Input("currentPageIndex") public currentPageIndex: number;
  @Input("totalRecords") public totalRecords: number;

  ofstr: string = "";
  
  constructor(private el: ElementRef, private renderer: Renderer2, private translate: TranslateService) {
    this.ofstr = this.translate.instant("general.of");
  }

  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.el!=null && this.el.nativeElement!=null){
      for(let i=0; i< this.el.nativeElement.childNodes.length; i++){
        this.renderer.removeChild(this.el.nativeElement, this.el.nativeElement.childNodes[0]);
      }
      const text = this.renderer.createText(this.calculateNewPagingText());
      this.renderer.appendChild(this.el.nativeElement, text);
    }
    
  }

  calculateNewPagingText(): string{
    if(this.totalRecords==0){
      return "0 - 0 "+this.ofstr+" 0";
    }
    let from: number = this.currentPageSize * this.currentPageIndex + 1;
    let to: number = this.currentPageSize * this.currentPageIndex + this.currentPageSize;
    if(to>this.totalRecords){
      to = this.totalRecords;
    }
    return from+" - "+to+" "+this.ofstr+" "+this.totalRecords;
  }
}
