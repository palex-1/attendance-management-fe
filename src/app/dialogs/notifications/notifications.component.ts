import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { ComponentFactory, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationMessage } from './notification-message.model';
import { NotificationComponent } from './notification/notification.component';
import { MessageNotifierService } from './message-notifier.service';

const DEFAULT_TIME: number = 8000;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {

  @ViewChild("notificationContainer", { read: ViewContainerRef, static: true }) 
  container;
  
  subscription: Subscription;
  
  constructor(private notifier: MessageNotifierService,
                  private componentFactoryResolver: ComponentFactoryResolver) { 
                  
                }

  ngOnInit() {
    this.container.clear(); 
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.subscription = this.notifier.notificationChange
    .subscribe(
      (notification: NotificationMessage) => {
        if(notification!=null){
          this.createComponent(notification);
        }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createComponent(notification: NotificationMessage) {
    //this.container.clear(); 
    const factory: ComponentFactory<NotificationComponent> = this.componentFactoryResolver
                                                .resolveComponentFactory(NotificationComponent);

    let componentRef: ComponentRef<NotificationComponent> = this.container.createComponent(factory);
    componentRef.instance.message = notification.detail;
    componentRef.instance.title = notification.title;
    componentRef.instance.severity = notification.severity;
    componentRef.instance.delay = notification.time;
    let delay: number = notification.time;
    
    this.delayRemoveComponent(componentRef, delay);
  }

 
  delayRemoveComponent(componentRef: ComponentRef<NotificationComponent>, delay: number){
    let that = this;
    let fixedDelay: number = DEFAULT_TIME;

    if(delay!=null && delay>0){
      fixedDelay = delay;
    }
    setTimeout(
      ()=>{
        componentRef.instance.close(
          that.removeCallback(componentRef, that), componentRef, that
        );
      },
      fixedDelay 
    )
  }

  removeCallback(componentRef, that) {
    return function (componentRef, that) {
        return that.removeComponentInstance(componentRef);
    };
 }

  removeComponentInstance(componentRef: ComponentRef<NotificationComponent>){
    componentRef.destroy()
  }


}
