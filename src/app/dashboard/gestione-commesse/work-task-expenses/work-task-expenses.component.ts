import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { WorkTaskExpensesDTO } from 'src/app/model/dtos/incarico/work-task-expenses-dto.model';
import { WorkTaskExpensesService } from 'src/app/model/services/incarico/work-task-expenses.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { AddWorkTaskExpenseModalComponent } from '../add-work-task-expense-modal/add-work-task-expense-modal.component';
import { UpdateWorkTaskExpenseModalComponent } from '../update-work-task-expense-modal/update-work-task-expense-modal.component';

@Component({
  selector: 'app-work-task-expenses',
  templateUrl: './work-task-expenses.component.html',
  styleUrls: ['./work-task-expenses.component.scss']
})
export class WorkTaskExpensesComponent implements OnInit {
  
  @ViewChild('addExpenseModalRef', { static: false })
  addExpenseModalRef: AddWorkTaskExpenseModalComponent;
  
  @ViewChild('updateExpenseModalRef', { static: false })
  updateExpenseModalRef: UpdateWorkTaskExpenseModalComponent;
  

  public sortBy = new OrderEvent();
  private deleteOperationInProgress: boolean = false;
  
  constructor(private workTaskExpensesService: WorkTaskExpensesService,
                private errorHandler: ChainExceptionHandler, private loader: LoadingService,
                private confirmer: CustomConfirmationService, private notifier: MessageNotifierService) { 
    
  }

  ngOnInit(): void {
  }

  

  canAddWorkExpenses(){
    if(this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses!=null && 
      this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses.creationPermission){
        return true;
    }
    return false;
  }

  canUpdateWorkExpenses(){
    if(this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses!=null && 
      this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses.updatePermission){
        return true;
    }
    return false;
  }

  canDeleteWorkExpenses(){
    if(this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses!=null && 
      this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses.deletePermission){
        return true;
    }
    return false;
  }

  onAddNewExpense(expense: WorkTaskExpensesDTO){
    if(expense!=null){
      this.workTaskExpensesService.pushOnTopOfExpenses(expense);
    }
  }

  onUpdateExpense(expense: WorkTaskExpensesDTO){
    if(expense!=null){
      this.workTaskExpensesService.replaceExpense(expense)
    }
  }
  

  openAddDialog(){
    this.addExpenseModalRef.openDialog();
  }
  
  openWorkTaskUpdateModal(elem){
    this.updateExpenseModalRef.openDialog(elem);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }

  
  resetFilters(){
    this.workTaskExpensesService.resetFilters();
    this.refreshData();
  }

  getCurrentPageIndex(): number{
    return this.workTaskExpensesService.pageIndex;
  }

  getTotalRecords(): number{
    return this.workTaskExpensesService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.workTaskExpensesService.currentPageSize;
  }

  refreshData(){
    this.loader.startLoading();

    this.workTaskExpensesService.loadTaskCodeExpenses()
          .subscribe(
            succ=>{
              this.loader.endLoading();
            },
            error=>{
              this.errorHandler.manageErrorWithLongChain(error.status);
              this.loader.endLoading();
            }
          );
  }

  delete(elem){
    if(this.deleteOperationInProgress){
      return;
    }

    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallbackWithParams("message.sure-to-expense",
      ()=>{ that.executeDelete(elem); }, [elem.title]
    )

  }

  executeDelete(expense: any) {
    this.deleteOperationInProgress = true;
    this.loader.startLoading();

    this.workTaskExpensesService.deleteExpense(expense)
    .subscribe(
      succ=>{
        this.loader.endLoading();
        this.deleteOperationInProgress = false;
        this.refreshData()
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-deleted")
      },
      (err: HttpErrorResponse)=>{
        this.deleteOperationInProgress = false;
        this.errorHandler.manageErrorWithLongChain(err.status);
        this.refreshData()
        this.loader.endLoading();
      }
    )
  }

  get expenses(): WorkTaskExpensesDTO[]{
    if(this.workTaskExpensesService.currentLoadedData==null){
      return [];
    }
    return this.workTaskExpensesService.currentLoadedData;
  }

  filtersChanged(event){
    this.refreshData();
  }

  changePage(event: PaginationEvent) {
    this.workTaskExpensesService.pageIndex = event.selectedPage;
    this.workTaskExpensesService.currentPageSize = event.pageSize;
    this.refreshData();
  }


  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.workTaskExpensesService.currentSortBy = event;
    this.refreshData();
  }

  get expenseTypesMap(){
    return this.workTaskExpensesService.expenseTypesMap;
  }

  get titleFilter(): string{
    return this.workTaskExpensesService.titleFilter;
  }

  set titleFilter(value: string) {
    this.workTaskExpensesService.titleFilter = value;
  }

  get expenseTypeFilter(): string{
    return this.workTaskExpensesService.expenseTypeFilter;
  }

  set expenseTypeFilter(value: string) {
    this.workTaskExpensesService.expenseTypeFilter = value;
  }

  

  get dateStartFilter(){
    return this.workTaskExpensesService.dateStartFilter;
  }

  get dateEndFilter(){
    return this.workTaskExpensesService.dateEndFilter;
  }

  onChangeDateToFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    
    this.workTaskExpensesService.dateEndFilter = parkDate;
  }

  onChangeDateFromFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.workTaskExpensesService.dateStartFilter = parkDate;
  }

  convertExpenseType(type: string){
    if(type==null){
      return '';
    }
    
    if(this.expenseTypesMap[type]!=null){
      return this.expenseTypesMap[type]
    }
    return '';
  }


}
