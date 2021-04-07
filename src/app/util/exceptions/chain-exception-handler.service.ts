import { Injectable } from "@angular/core";
import { MessageNotifierService } from "../../dialogs/notifications/message-notifier.service";


@Injectable()
export class ChainExceptionHandler {
    
    public static SERVER_UNREACHABLE: number = 0;
    public static BAD_DATA = 400;
    public static UNAUTHORIZED: number = 401;   
    public static FORBIDDEN: number = 403;
    public static NOT_FOUND: number = 404;
    public static NOT_ACCEPTABLE: number = 406;
    public static TOO_MANY_REQUESTS: number = 429;
    public static CONFLICT_ERROR: number = 409;
    public static UNPROCESSABLE_ENTITY: number = 422;
    public static INTERNAL_SERVER_ERROR: number= 500; 
    public static Service_Unavailable:number = 503

    public static MANAGED_STATUS : number[] = [ChainExceptionHandler.SERVER_UNREACHABLE, ChainExceptionHandler.BAD_DATA, 
            ChainExceptionHandler.UNAUTHORIZED, ChainExceptionHandler.FORBIDDEN, ChainExceptionHandler.NOT_FOUND, ChainExceptionHandler.CONFLICT_ERROR, 
            ChainExceptionHandler.INTERNAL_SERVER_ERROR];
  static f: number;

    constructor(private notifier: MessageNotifierService){
    }

    
    /**
     * Managed errors 0, 500, 401, 403 
     * @param nextChainHandler function to be called if the error can't be managed
     */
    manageErrorWithShortChain(status: number) {
        if(status==ChainExceptionHandler.SERVER_UNREACHABLE){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-unreachable-server");
            return;
        }
        if(status>=ChainExceptionHandler.INTERNAL_SERVER_ERROR){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-internal-server-error");
            return;
        }
        if(status==ChainExceptionHandler.FORBIDDEN){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-not-granted-permissions");
            return;
        }
        if(status==ChainExceptionHandler.UNAUTHORIZED){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-auth-needed");
            return;
        }
        this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-other-error");
    }



    manageErrorWithLongChain(status: number){
        if(status==ChainExceptionHandler.SERVER_UNREACHABLE){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-unreachable-server");
            return;
        }
        if(status>=ChainExceptionHandler.INTERNAL_SERVER_ERROR){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-internal-server-error");
            return;
        }
        if(status==ChainExceptionHandler.FORBIDDEN){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-not-granted-permissions");
            return;
        }
        if(status==ChainExceptionHandler.UNAUTHORIZED){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-auth-needed");
            return;
        }
        if(status==ChainExceptionHandler.CONFLICT_ERROR){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-unique-constraint-violations");
            return;
        }
        if(status==ChainExceptionHandler.BAD_DATA){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-invalid-data");
            return;
        }
        if(status==ChainExceptionHandler.TOO_MANY_REQUESTS){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.enhance-your-calm");
            return;
        }
        if(status==ChainExceptionHandler.NOT_FOUND){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-not-found");
            return;
        }
        if(status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
            this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-unprocessable-entity");
            return;
        }
        if(status==ChainExceptionHandler.Service_Unavailable){
            this.notifier.notifyErrorWithI18nAndStandardTitle("message.service-unavailable");
            return;
        }
        if(status==ChainExceptionHandler.NOT_ACCEPTABLE){
            this.notifier.notifyErrorWithI18nAndStandardTitle("message.not-acceptable");
            return;
        }
        
        this.notifier.notifyErrorWithI18nAndStandardTitle("generic.message-for-other-error");
    }
        

}