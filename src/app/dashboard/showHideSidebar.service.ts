import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable()
export class ShowHideSidebarService {

    private subject = new Subject<boolean>();
    private currentStatus: boolean = true;

    constructor(){
    }

    hideSidebar() {
        this.subject.next(false);
        this.currentStatus = false;
    }

    showSidebar(): void {
        this.subject.next(true);
        this.currentStatus = true;
    }

    getStatus(): Observable<boolean> {
        return this.subject.asObservable();
    }

    getCurrentStatusAsBoolean(): boolean{
        return this.currentStatus;
    }

}