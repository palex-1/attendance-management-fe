import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-turnstile-token-view',
  templateUrl: './turnstile-token-view.component.html',
  styleUrls: ['./turnstile-token-view.component.scss']
})
export class TurnstileTokenViewComponent implements OnInit {

  @ViewChild('tokenTurnstileModal', { static: true })
  tokenTurnstileModal: ElementRef;

  @Input()
  token: string;

  constructor() { }

  ngOnInit(): void {
  }


  openDialog(token: string){
    this.token = token
    $(this.tokenTurnstileModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    $(this.tokenTurnstileModal.nativeElement).modal('hide');
  }

}
