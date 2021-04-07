import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IsMobileService } from 'src/app/util/sizing/is-mobile-service.service';
import { Subject } from 'rxjs';
import { OrderEvent } from 'src/app/util/order-event.model';
import { SuccessfullyLoginLogsService } from 'src/app/model/services/auth/successfully-login-logs.service';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { FilterElement, FilterType } from '../components/custom-filters/custom-filters.component';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';


declare const $:any;

@Component({
  selector: 'app-access-logs',
  templateUrl: './access-logs.component.html',
  styleUrls: ['./access-logs.component.css']
})
export class AccessLogsComponent implements OnInit {

  areCollapsedFilters: boolean = false;
  id: any;
  public sortBy = new OrderEvent();

  filterRequestsInProgress: number = 0;
  
  constructor(private loader: LoadingService,
                public isMobileService: IsMobileService,
                  public succLogsSrv: SuccessfullyLoginLogsService) { }


  ngOnInit() {
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.succLogsSrv.currentSortBy = event;
    this.refreshAccesLogs();
  }

  filtersChanged(event){
    this.refreshAccesLogs();
  }
  
  getCurrentPageIndex(): number{
    return this.succLogsSrv.pageIndex;
  }

  getTotalRecords(): number{
    return this.succLogsSrv.totalElements;
  }

  getCurrentPageSize(): number{
    return this.succLogsSrv.currentPageSize;
  }

  get accessLogsFilter(){
    return this.succLogsSrv.accessLogsFilter;
  }

  refreshAccesLogs(){
    this.loader.startLoading();

    this.succLogsSrv.loadInitialInformation(undefined, true).subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.succLogsSrv.pageIndex = event.selectedPage;
    this.succLogsSrv.currentPageSize = event.pageSize;
    this.refreshAccesLogs();
  }
  
  get userAccess(){
    return this.succLogsSrv.currentLoadedUserAccessLogs;
  }


}
