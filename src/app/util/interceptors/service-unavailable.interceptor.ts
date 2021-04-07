import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/dashboard/components/service-unavailable/message.model';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ServiceUnavailableService } from 'src/app/dashboard/components/service-unavailable/service-unavailable.service';


@Injectable()
export class ServiceUnavailableInterceptor implements HttpInterceptor {

  constructor(private notifier: MessageNotifierService,
                private serviceUnavailableSrv: ServiceUnavailableService) {
                  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
      return next.handle(request).pipe(
        tap(
            (event) => {
                if (event instanceof HttpResponse) {
                  if (event.status === 0 || event.status === 503) {
                    this.manageServiceUnavailable(event.url);
                  }
                }
            },
            (error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 0 || error.status === 503) {
                      this.manageServiceUnavailable(error.url);
                    }
                }
            }
        )
    );

  }


  manageServiceUnavailable(url: string){
    this.notifier.notifyErrorWithI18nAndStandardTitle("message.service-unavailable", [], 10000);
    this.serviceUnavailableSrv.reportServiceUnavailableMessage(new Message(url));
  }



}
