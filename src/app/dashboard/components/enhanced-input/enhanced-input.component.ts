import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class EnhancedInputStatus{
  value: any;
  isValid: boolean = false;
}

@Component({
  selector: 'app-enhanced-input',
  templateUrl: './enhanced-input.component.html',
  styleUrls: ['./enhanced-input.component.scss']
})
export class EnhancedInputComponent implements OnInit, OnChanges {

  @Input()
  label: string;

  @Input()
  placeholder: string;

  @Input()
  inputAdditionalClasses: string;

  @Input()
  labelAdditionalClasses: string;

  @Input()
  inputStatus: EnhancedInputStatus;

  @Input()
  showValidationErrors: boolean;

  @Input()
  errorLabel: string;

  @Input()
  notNullValidate: boolean;

  @Input()
  regex: RegExp;

  @Input()
  validationCallback: Function;

  @Input()
  formSubmitted: boolean;

  @Input()
  showErrorAfterSubmit: boolean;

  invalidField: boolean = false;
  showValidationErrorInternal: boolean = false;
  errorLabelInternal: string = '';
  notNullValidateInternal: boolean = false;
  regexValidationInternal: RegExp;
  fieldIsNull: boolean = false;

  initializedComponent: boolean = false;

  constructor(private translate: TranslateService) { 
  }

  ngOnInit() {
    if(this.showValidationErrors){
      this.showValidationErrorInternal = true;
    }
    if(this.errorLabel!=null){
      this.errorLabelInternal = this.errorLabel;
    }else{
      this.errorLabelInternal = this.translate.instant("message.invalid-field");
    }
    if(this.notNullValidate!=null){
      this.notNullValidateInternal = this.notNullValidate;
    }
    if(this.regex!=null){
      this.regexValidationInternal = new RegExp(this.regex);
    }
    if(this.formSubmitted){
      this.validateField();
    }
    this.initializedComponent = true;
  }

  ngOnChanges(changes: SimpleChanges){
    if(!this.initializedComponent){
      return;
    }
    if(changes.formSubmitted){
      if(changes.formSubmitted.currentValue){
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

  onInputChange(){
    this.fieldIsNull = false;
    this.invalidField = false;
    this.validateField();
    if(this.inputStatus!=null){
      this.inputStatus.isValid = !this.invalidField;
    }
  }

  get placeholderInternal(){
    if(this.placeholder==null){
      return '';
    }
    return this.placeholder;
  }

  get value(){
    if(this.inputStatus==null){
      return;
    }
    return this.inputStatus.value;
  }

  set value(value: any){
    this.inputStatus.value = value;
    this.onInputChange();
    if(this.inputStatus==null){
      return;
    }
  }

  validateField(){
    this.fieldIsNull = false;
    this.invalidField = false;

    if(!this.showValidationErrorInternal){
      return;
    }

    this.checkNull();

    if(this.regexValidationInternal!=null){
      if(this.inputStatus==null || this.inputStatus.value==null){
        this.invalidField = true;
      }else{
        let stringValueOfInput: string = this.inputStatus.value+'';
        if(!this.regexValidationInternal.test(stringValueOfInput)){
          this.invalidField = true;
        }
      }
    }

    if(this.validationCallback!=null){
      if(this.inputStatus==null || !this.validationCallback(this.inputStatus.value)){
        this.invalidField = true;
      }
    }
  }

  private checkNull(): void{
    if(this.notNullValidateInternal){
      if(this.inputStatus==null || this.inputStatus.value==null || (this.inputStatus.value+'').trim()==''){
        this.fieldIsNull = true;
        this.invalidField = true;
        return;
      }
    }
  }

  get inputClasses(): string{
    if(this.inputAdditionalClasses==null){
      return '';
    }
    return this.inputAdditionalClasses;
  }

  get labelClasses(): string {
    if(this.labelAdditionalClasses==null){
      return '';
    }
    return this.labelAdditionalClasses;
  }

}
