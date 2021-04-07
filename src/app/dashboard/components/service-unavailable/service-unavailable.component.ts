import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ServiceUnavailableService } from './service-unavailable.service';

@Component({
  selector: 'app-service-unavailable',
  templateUrl: './service-unavailable.component.html',
  styleUrls: ['./service-unavailable.component.scss']
})
export class ServiceUnavailableComponent implements OnInit {

  @ViewChild("serviceUnavailableBlockingModal", { static: true })
  serviceUnavailableBlockingModal: ElementRef;

  currentResourceTringToLoad: string = null;

  constructor(private zone: NgZone,
                private serviceUnavailableSrv: ServiceUnavailableService) { }

  ngOnInit() {
    this.serviceUnavailableSrv.messages.subscribe(m => {
        if(m!=null){
          this.currentResourceTringToLoad = m.text
        }else{
          this.currentResourceTringToLoad = null;
        }
        this.showModal();
      } 
    );
  }

  reload(){
    this.zone.runOutsideAngular(() => {
      location.reload();
    });
    this.currentResourceTringToLoad = null;
  }

  showModal(): void{
    this.serviceUnavailableBlockingModal.nativeElement.style.display = 'block';
  }

  hideModal(): void{
    this.serviceUnavailableBlockingModal.nativeElement.style.display = 'none';
  }
  
}
