import { Component, OnInit, Input, TemplateRef, SimpleChanges } from '@angular/core';

export class EnhancedSelectStatus{
  value: any;
  isValid: boolean = false;
}

@Component({
  selector: 'app-enhanced-select',
  templateUrl: './enhanced-select.component.html',
  styleUrls: ['./enhanced-select.component.scss']
})
export class EnhancedSelectComponent implements OnInit {

  @Input()
  labelAdditionalClasses: string;

  @Input()
  selectAdditionalClasses: string;

  @Input()
  optionsTemplate: TemplateRef<any>;

  @Input()
  notNullValidate: boolean;

  @Input()
  label: string;

  @Input()
  elements: string[];

  @Input()
  selectStatus: EnhancedSelectStatus;

  @Input()
  showValidationErrors: boolean;

  @Input()
  formSubmitted: boolean;

  @Input()
  showErrorAfterSubmit: boolean;

  initializedComponent: boolean = false;
  showValidationErrorInternal: boolean = false;
  notNullValidateInternal: boolean = false;
  fieldIsNull: boolean = false;
  invalidField: boolean = false;

  constructor() { }

  ngOnInit() {
    if(this.showValidationErrors){
      this.showValidationErrorInternal = true;
    }
    if(this.notNullValidate!=null){
      this.notNullValidateInternal = this.notNullValidate;
    }
    this.initValidation();

    this.initializedComponent = true;
  }

  ngOnChanges(changes: SimpleChanges){
    if(!this.initializedComponent){
      return;
    }
    if(changes['formSubmitted']){
      if(changes['formSubmitted'].currentValue){
        this.validateField();
      }
    }
  }

  get canShowErrors(){
    if(this.showErrorAfterSubmit){
      if(this.formSubmitted){
        return true;
      }else{
        return false;
      }
    }
    return true;
  }

  initValidation(){
    this.validateField();
    if(this.selectStatus!=null){
      this.selectStatus.isValid = !this.fieldIsNull;
    }
  }

  onSelectChange(){
    this.validateField();
    if(this.selectStatus!=null){
      this.selectStatus.isValid = !this.fieldIsNull;
    }
  }

  validateField(){
    this.fieldIsNull = false;
    this.invalidField = false;
    if(!this.showValidationErrorInternal){
      return;
    }
    this.checkNull();
  }

  private checkNull(): void{
    if(this.notNullValidateInternal){
      if(this.selectStatus==null || this.selectStatus.value==null || this.selectStatus.value==''){
        this.fieldIsNull = true;
        this.invalidField = true;
        return;
      }
    }
  }

  get value(){
    if(this.selectStatus==null){
      return;
    }
    return this.selectStatus.value;
  }

  set value(value: any){
    if(this.selectStatus==null){
      return;
    }
    this.selectStatus.value = value;
    this.onSelectChange();
  }

  get elemList(): string[]{
    if(this.elements==null){
      return [];
    }
    return this.elements;
  }

  get labelClasses(): string {
    if(this.labelAdditionalClasses==null){
      return '';
    }
    return this.labelAdditionalClasses;
  }

  get selectClasses(): string {
    if(this.selectAdditionalClasses==null){
      return '';
    }
    return this.selectAdditionalClasses;
  }
  
}
