import { Component, OnInit, Input, ElementRef, ViewChild, ComponentRef } from '@angular/core';

declare const $:any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @ViewChild('toastId', { static: false }) 
  toast: ElementRef;

  @Input()
  title: string;

  @Input()
  message: string;

  @Input()
  severity: string;

  @Input()
  delay: number;

  currentTime: Date = new Date();

  isAlreadyClosed: boolean;
  closed: boolean = false;

  constructor() { 
  }

  ngOnInit() {
    this.currentTime = new Date();
  }

  get messageText(): string{
    if(this.message==null){
      return '';
    }
    return this.message;
  }

  get messageTitle(): string {
    if(this.title==null){
      return '';
    }
    return this.title;
  }

  isError(): boolean{
    return this.severity=='error';
  }

  isInfo(): boolean{
    return this.severity=='info';
  }

  isWarning(): boolean{
    return this.severity=='warn';
  }

  isSuccess(): boolean{
    return this.severity=='success';
  }

  get backgroundClass(): string {
    if(this.isError()){
      return 'error-background';
    }
    if(this.isSuccess()){
      return 'success-background';
    }
    if(this.isWarning()){
      return 'warning-background';
    }
    
    return 'info-background';
  }

  close(callback?:any, componentRef ?: ComponentRef<NotificationComponent>, that ?: any){
    this.fadeOut();
    setTimeout(
      ()=>{
        this.closed = true;
        if(callback!=null){
          callback(componentRef, that);
        }        
      }, 250
    )
  }

  fadeOut(){
    if(this.toast!=null && this.toast.nativeElement!=null && this.toast.nativeElement.style!=null && this.toast.nativeElement.style.animation!=null){
      this.toast.nativeElement.style.animation = 'snackbarOut 0.3s';
    }
  }


}
