import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss']
})
export class CustomCheckboxComponent implements OnInit, OnChanges {

  @ViewChild("customCheckbox", { static: true })
  customCheckbox: ElementRef;

  @Input()
  checked: boolean = false;

  @Input()
  label: string = '';

  @Output()
  onStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  status: boolean = false; //false=unchecked --- true=checked
  private initializingComponent: boolean = true;

  constructor() { }

  ngOnInit() {
    this.status = this.checked;
    this.updateCheckboxStatus();
    this.initializingComponent = false;
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.initializingComponent){
      return;
    }
    if(changes.checked!=null && changes.checked!=undefined){
        if(this.status!=changes.checked.currentValue){
          this.status = changes.checked.currentValue;
          this.updateCheckboxStatus();
        }
    }
  }

  toggleCheckStatus(){
    this.status = !this.status;
    this.updateCheckboxStatus();
    this.onStatusChange.emit(this.status);
  }

  updateCheckboxStatus(): void{
    $(this.customCheckbox.nativeElement).prop('checked', this.status);
  }
}
