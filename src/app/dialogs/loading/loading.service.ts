import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { LoadingMessage } from "./loading-message.model";

@Injectable()
export class LoadingService {
    private subject = new Subject<LoadingMessage>();

    private reportLoadingMessage(msg: LoadingMessage) {
        this.subject.next(msg);
    }

    startLoading(){
        let park: LoadingMessage = new LoadingMessage();
        park.show = true;
        park.message = '';
        this.reportLoadingMessage(park);
    }

    endLoading(){
        let park: LoadingMessage = new LoadingMessage();
        park.show = false;
        park.message = '';
        this.reportLoadingMessage(park);
    }

    get messages(): Observable<LoadingMessage> {
        return this.subject;
    }
}
