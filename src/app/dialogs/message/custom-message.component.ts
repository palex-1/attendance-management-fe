import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from  '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CustomMessageService } from './custom-message.service';

declare var $: any;

@Component({
  selector: 'app-message',
  templateUrl: './custom-message.component.html',
  styleUrls: ['./custom-message.component.css']
})
export class CustomMessageComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(private messageService: CustomMessageService, 
                    private translate: TranslateService) { }


  ngOnInit() {
    this.subscribeToMessageRequests();
  }

  
  subscribeToMessageRequests() {
    this.subscription = this.messageService.massageChange
    .subscribe(
       message => {
            
            var title = document.getElementById("modal-for-message-com-title");
            var body = document.getElementById("modal-for-message-com-body");
            
            title.innerHTML = message.title;
            body.innerHTML = message.mess;


            $("#modal-for-messaging").modal();

    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}