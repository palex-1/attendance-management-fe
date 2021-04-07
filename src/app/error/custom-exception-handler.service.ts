import { ErrorHandler, Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';
import { FeLoggingDTO } from '../model/dtos/fe-logging-dto.model';
import { FrontendLoggerService } from '../model/services/system/frontend-logger.service';

@Injectable()
export class CustomExceptionHandler implements ErrorHandler {

  constructor(private frontendLoggerSrv: FrontendLoggerService) { 

  }

  handleError(error) {
      try{
        this.logInConsole(error);
        this.sendLogErrorToBackend(error);
      }catch(e){
        //do nothing here to avoid infinite loop
      }
  }

  logInConsole(error): void{
      if(environment.log_in_console_enabled){
        console.error(error);
      }
  }

  sendLogErrorToBackend(error): void{
    if(environment.log_in_backend_enabled){
        let errorStr: string = error + "";
        let frontendVersion: string = environment.frontend_version;
        let date: Date = new Date();

        let dto: FeLoggingDTO = new FeLoggingDTO(date, errorStr, frontendVersion);

        this.frontendLoggerSrv.logError(dto)
            .subscribe(
                (succ) => {
                    //do nothing
                },
                (error) => {
                    this.logInConsole(error);
                    //do nothing here to avoid infinite loop
                }
            )
    }
  }
  
}