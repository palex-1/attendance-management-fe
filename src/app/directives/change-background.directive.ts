import { Directive, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appChangeBackground]'
})
export class ChangeBackgroundDirective implements AfterViewInit, OnChanges{
  @Input('backgroundColor') backgroundColor: string;

  private el: HTMLElement;
  private initializingComponent: boolean = false;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.initializingComponent){
      return;
    }
    if(changes['backgroundColor']!=null && changes['backgroundColor']!=undefined){
        if(changes['backgroundColor'].previousValue!=changes['backgroundColor'].currentValue){
          this.setBackgroundColor();
        }
    }
  }

  private setBackgroundColor(){
    if(this.backgroundColor!=null){
      this.el.style.color = 'white';

      // let rgb =  this.hexToRgb(this.backgroundColor);
      
      // var o = Math.round(((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) /1000);
            
      // if(o > 125) {
      //   this.el.style.color = 'black';
      // }else{ 
      //   this.el.style.color = 'white';
      // }
    }else{
      this.el.style.color = 'black';
    }

    this.el.style.backgroundColor = this.backgroundColor;
  }

  ngAfterViewInit() {
    this.initializingComponent = true;
    this.setBackgroundColor();
    this.initializingComponent = false;
  }

  private hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

}
