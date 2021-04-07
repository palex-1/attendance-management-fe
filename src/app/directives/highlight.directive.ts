import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightCustom]'
})
export class HighlightDirective {

  @Input() highlightColor: string;

  @Input() highlightDisabled: boolean = false;
  
  constructor(private el: ElementRef) {
  }

  private getHighlightColor(): string{
    if(this.highlightColor==null){
      return 'yellow';
    }
    return this.highlightColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.getHighlightColor());
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  
  private highlight(color: string) {
    if(!this.highlightDisabled){
      this.el.nativeElement.style.backgroundColor = color;
    }
  }

}
