import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @ViewChild("loaderModal", { static: true })
  loaderModal: ElementRef;

  constructor(private loaderSrv: LoadingService, private router: Router) { }

  ngOnInit() {
    this.loaderSrv.messages.subscribe(m => {
        if(m==null || m.show){
          this.showModal();
        }else{
          this.hideModal();
        }
      } 
    );

    this.router.events.pipe(
            filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel)
        )
        .subscribe(
            e => { 
              this.hideModal(); 
            }
        );

  }

  showModal(): void{
    this.loaderModal.nativeElement.style.display = 'block';
  }

  hideModal(): void{
    this.loaderModal.nativeElement.style.display = 'none';
  }

}
