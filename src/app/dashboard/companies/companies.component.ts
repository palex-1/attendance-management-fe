import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { CompanyDTO } from 'src/app/model/dtos/company/company.dto';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { CompaniesService } from 'src/app/model/services/settings/companies.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { CompanyModalComponent } from './companies-modal/company-modal.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  
  @ViewChild('companyModal', { static: false })
  companyModal: CompanyModalComponent;

  

  public sortBy = new OrderEvent();
  private deleteOperationInProgress: boolean = false;


  constructor(private companyService: CompaniesService, private authoritiesService: AuthoritiesService, private router: Router, 
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private confirmer: CustomConfirmationService) { 

  }

  ngOnInit(): void {
  }

  openAddDialog(){
    this.companyModal.openAddDialog();
  }

  openEditDialog(company: CompanyDTO){
    this.companyModal.openEditDialog(company);
  }



  delete(company: CompanyDTO){
    if(this.deleteOperationInProgress){
      return;
    }

    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-the-company",
      ()=>{ that.executeDeleteCompany(company); }
     )
  }

  executeDeleteCompany(company: CompanyDTO){
    this.deleteOperationInProgress = true;
    this.loader.startLoading();

    this.companyService.deleteCompany(company)
    .subscribe(
      succ=>{
        this.loader.endLoading();
        this.deleteOperationInProgress = false;
        this.refreshCompanies();
      },
      (err: HttpErrorResponse)=>{
        this.deleteOperationInProgress = false;
        this.manageErrorOnDeleteLevel(err);
        this.loader.endLoading();
      }
    )
  }

  manageErrorOnDeleteLevel(err: HttpErrorResponse) {
    this.exceptionHandler.manageErrorWithLongChain(err.status)
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.companyService.currentSortBy = event;
    this.refreshCompanies();
  }
  
  resetFilters(){
    this.companyService.resetFilters();
    this.refreshCompanies();
  }

  filtersChanged(){
    this.refreshCompanies();
  }
  
  getCurrentPageIndex(): number{
    return this.companyService.pageIndex;
  }

  getTotalRecords(): number{
    return this.companyService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.companyService.currentPageSize;
  }

  refreshCompanies(){
    this.loader.startLoading();

    this.companyService.realodAllCompanies().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.companyService.pageIndex = event.selectedPage;
    this.companyService.currentPageSize = event.pageSize;
    this.refreshCompanies();
  }
  
  
  get companies(): CompanyDTO[]{
    return this.companyService.currentLoadedData;
  }


  get nameFilter(){
    return this.companyService.nameFilter;
  }

  set nameFilter(value: string){
    this.companyService.nameFilter = value;
  }

  get descriptionFilter(){
    return this.companyService.descriptionFilter;
  }

  set descriptionFilter(value: string){
    this.companyService.descriptionFilter = value;
  }



}
