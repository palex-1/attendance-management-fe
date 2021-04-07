import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordValidatorService } from './password-validator.service';
import { StandardValidatorService } from './standard-validators.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ PasswordValidatorService, StandardValidatorService ],
  declarations: [ ]
})
export class ValidatorsModule { }
