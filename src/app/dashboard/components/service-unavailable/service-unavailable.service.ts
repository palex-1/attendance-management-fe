import { Injectable } from "@angular/core";
import { Message } from "./message.model";
import { Subject, Observable } from "rxjs";

@Injectable()
export class ServiceUnavailableService {
    private subject = new Subject<Message>();

    reportServiceUnavailableMessage(msg: Message) {
        this.subject.next(msg);
    }

    get messages(): Observable<Message> {
        return this.subject;
    }
}