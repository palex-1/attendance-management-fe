import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { reduce } from 'rxjs/operators';

@Component({
  selector: 'app-vertical-align-card',
  templateUrl: './vertical-align-card.component.html',
  styleUrls: ['./vertical-align-card.component.scss']
})
export class VerticalAlignCardComponent implements OnInit {

  @ViewChild("cardRef", { static: true })
  cardRef: ElementRef;
  
  @Input()
  icon: string;

  @Input()
  title: string;

  @Input()
  stringValue: string | number;

  @Input()
  color: string = 'red';

  @Input()
  upperIcon: string;

  constructor(private renderer: Renderer2) { 

  }

  ngOnInit() {
    this.renderer.setStyle(this.cardRef.nativeElement, 'background', this.getCardColor());
  }

  getCardColor(){
    if(this.color==null){
      return 'linear-gradient(45deg,#4099ff,#73b4ff)';
    }
    return this.color;
  }

}
