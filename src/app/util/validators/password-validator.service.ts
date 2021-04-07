import { Injectable } from "@angular/core";


@Injectable()
export class PasswordValidatorService{
    //must contains at least one digit, one lower case, one upper case, and must be 6 length
  //private static REGEX_TO_MATCH = "[0-9a-zA-Z]{6,20}$/)";
  private static REGEX_ONE_DIGIT = "\\.*[0-9]\\.*";
  private static REGEX_ONE_LOWER_CASE_LETTER = "\\.*[a-z]\\.*";
  private static REGEX_ONE_UPPER_CASE_LETTER = "\\.*[A-Z]\\.*";
  private static REGEX_MIN_LENGHT = "(.){6,20}";

  private static REGEX_TO_MATCH: string[] = [PasswordValidatorService.REGEX_ONE_DIGIT, PasswordValidatorService.REGEX_ONE_LOWER_CASE_LETTER, 
    PasswordValidatorService.REGEX_ONE_UPPER_CASE_LETTER, PasswordValidatorService.REGEX_MIN_LENGHT];

  //must not contains password, admin, spaces and 123456
  //leave all fiels lower case
  private static MUST_NOT_CONTAINS_1: string[] = ["password", "admin", " ", "123456"];



  arePasswordEquals(psw1: string, psw2: string){
    return psw1===psw2;
  }


  isValidPassword(psw: string): boolean{
    if(psw==null){
      return false;
    }
    if(!this.passwordMatchesRegexChecks(psw)){
      return false;
    }
    if(!this.passwordMustContainsChecks(psw)){
      return false;
    }


    return true;
  }


  private passwordMatchesRegexChecks(psw : string): boolean{
    let i : number = 0;
    while(i<PasswordValidatorService.REGEX_TO_MATCH.length){
      let regex: string = PasswordValidatorService.REGEX_TO_MATCH[i];
      if(!psw.match(regex)){
        return false;
      }
      i++;
    }
    return true;
  }

  private passwordMustContainsChecks(psw: string) : boolean{
    let i : number = 0;
    while(i<PasswordValidatorService.MUST_NOT_CONTAINS_1.length){
      let tabu: string = PasswordValidatorService.MUST_NOT_CONTAINS_1[i];
      if(psw.toLowerCase().indexOf(tabu)>=0){
        return false;
      }
      i++;
    }
    return true;
  }



}