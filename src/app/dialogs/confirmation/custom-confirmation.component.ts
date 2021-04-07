import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomConfirmationService } from './custom-confirmation.service';
import { TranslateService } from  '@ngx-translate/core';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-confirmation',
  templateUrl: './custom-confirmation.component.html',
  styleUrls: ['./custom-confirmation.component.css']
})
export class CustomConfirmationComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  private currentConfirmationCallback :Function;
  private curretRejectCallback :Function;

  constructor(private confirmer: CustomConfirmationService, 
                    private translate: TranslateService) { }



  ngOnInit() {
    this.subscribeToConfirmationRequests();
  }

  

  subscribeToConfirmationRequests() {
    this.subscription = this.confirmer.confirmationChange
    .subscribe(confirmation => {
            
            var title = document.getElementById("modal-for-confirmation-title");
            var body = document.getElementById("modal-for-confirmation-body");
            
            title.innerHTML = confirmation.title;
            body.innerHTML = confirmation.mess;


            $("#modal-for-confirmation").modal();

            this.currentConfirmationCallback = confirmation.confirmationCallback;
            this.curretRejectCallback = confirmation.rejectCallback;
            
            /*this.confirmationService.confirm({
                            message: confirmation.mess,
                            header: confirmation.title,
                            icon: 'fa fa-question-circle',
                            accept: () => {
                                //execute callback method onAccept
                                confirmation.confirmationCallback();
                            },
                            reject: () => {
                                //this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
                            }
                        });*/


    });


  }



  noModalClicked(): void{
    $("#modal-for-confirmation").modal('hide');
    if(this.curretRejectCallback!=null){
      this.curretRejectCallback();
    }
    this.deleteCurrentCallback();
  }


  yesModalClicked(): void{
    $("#modal-for-confirmation").modal('hide');
    if(this.currentConfirmationCallback!=null){
      this.currentConfirmationCallback();
    }
    this.deleteCurrentCallback();
  }

  
  private deleteCurrentCallback(): void{
    this.currentConfirmationCallback = null;
    this.curretRejectCallback = null;
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}