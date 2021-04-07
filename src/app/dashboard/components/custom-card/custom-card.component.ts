import { Component, OnInit, Renderer2, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-custom-card',
  templateUrl: './custom-card.component.html',
  styleUrls: ['./custom-card.component.scss']
})
export class CustomCardComponent implements OnInit {

  @ViewChild("cardRef", { static: true })
  cardRef: ElementRef;

  @Input()
  cardTitle: string;

  @Input()
  color: string;

  @Input()
  iconClass: string;

  @Input()
  leftIconValue: string;

  @Input()
  subtitle: string;

  @Input()
  subtitleValue: string;

  @Input()
  subiconClass: string;

  @Input()
  titleIconClass: string;

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
