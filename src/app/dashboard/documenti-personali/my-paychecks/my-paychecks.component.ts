import { Component, OnInit } from '@angular/core';
import { OrderEvent } from 'src/app/util/order-event.model';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { MyPaychecksService } from 'src/app/model/services/impiegato/my-paychecks.service';
import { PaycheckDTO } from 'src/app/model/dtos/impiegato/paycheck-dto.model';
import { TicketDownloadDTO } from 'src/app/model/dtos/ticket-download.dto';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { TicketDownloadService } from 'src/app/model/services/system/ticket-download.service';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-my-paychecks',
  templateUrl: './my-paychecks.component.html',
  styleUrls: ['./my-paychecks.component.scss']
})
export class MyPaychecksComponent implements OnInit {

  monthsNumber: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  public sortBy = new OrderEvent();

  
  constructor(private loader: LoadingService, private myPaychecksService: MyPaychecksService, 
              private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler, 
              private ticketDownloadService: TicketDownloadService) {

  }

  ngOnInit(): void {
  }

  downloadPaycheck(paycheck: PaycheckDTO){
    this.loader.startLoading();

    this.myPaychecksService.downloadPaycheck(paycheck)
    .subscribe(
      (succ: GenericResponse<TicketDownloadDTO>) => {
        this.loader.endLoading()
        this.ticketDownloadService.executeFileDownloadWithBrowser(succ.data);
      },
      (err:HttpErrorResponse)=>{
        this.loader.endLoading()
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.myPaychecksService.currentSortBy = event;
    this.refreshUserPaychecks();
  }

  filtersChanged(){
    this.refreshUserPaychecks();
  }
  
  getCurrentPageIndex(): number{
    return this.myPaychecksService.pageIndex;
  }

  getTotalRecords(): number{
    return this.myPaychecksService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.myPaychecksService.currentPageSize;
  }

  refreshUserPaychecks(){
    this.loader.startLoading();

    this.myPaychecksService.realodPaychecks().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
      }
    );
  }

  resetFilters(){
    this.myPaychecksService.resetFilters();
    this.refreshUserPaychecks();
  }

  changePage(event: PaginationEvent) {
    this.myPaychecksService.pageIndex = event.selectedPage;
    this.myPaychecksService.currentPageSize = event.pageSize;
    this.refreshUserPaychecks();
  }
  
  get paychecks(){
    return this.myPaychecksService.currentLoadedData;
  }


  get yearFilter(){
    return this.myPaychecksService.yearFilter;
  }

  set yearFilter(year: number){
    this.myPaychecksService.yearFilter = year;
  }
  
  get monthFilter(){
    return this.myPaychecksService.monthFilter;
  }

  set monthFilter(month: number){
    if(month+''==null || month+''==''){
      this.myPaychecksService.monthFilter = null;
    }else{
      this.myPaychecksService.monthFilter = month;
    }
    
  } 
  
}
