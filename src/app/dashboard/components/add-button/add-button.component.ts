import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {

  @Output()
  onClick: EventEmitter<any> = new EventEmitter();

  @Input()
  tooltip: string;

  constructor() { }

  ngOnInit() {
  }

  buttonClicked(){
    this.onClick.emit();
  }

  getTooltip(): string{
    if(this.tooltip==null){
      return '';
    }
    return this.tooltip;
  }

}
