import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { WorkTaskExpensesDTO } from 'src/app/model/dtos/incarico/work-task-expenses-dto.model';
import { WorkTaskExpensesService } from 'src/app/model/services/incarico/work-task-expenses.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StringUtils } from 'src/app/util/string/string-utils';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';

declare const $: any;

@Component({
  selector: 'app-add-work-task-expense-modal',
  templateUrl: './add-work-task-expense-modal.component.html',
  styleUrls: ['./add-work-task-expense-modal.component.scss']
})
export class AddWorkTaskExpenseModalComponent implements OnInit {

  @ViewChild("modalRef", { static: true })
  modalRef: ElementRef;

  @Output()
  onSaveClick: EventEmitter<any> = new EventEmitter<any>();

  addOperationInProgress: boolean = false;
  showLoaderInModal: boolean = false;
  
	title : string = '';
	description : string = '';
	expenseType: string = '';
  private day: Date = null;
  currentDay: Date = null;
  amount: number = 0;

  constructor(private workTaskExpensesService: WorkTaskExpensesService,
              private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler) { 
  }

  ngOnInit() {
  }

  resetData(){
    this.title = '';
    this.description = '';
    this.expenseType = '';
    this.day = null;
    this.currentDay = null;
    this.amount = 0;
  }

  get showLoader(){
    return this.showLoaderInModal || this.addOperationInProgress;
  }

  openDialog(){
    $(this.modalRef.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  private closeDialog(){
    $(this.modalRef.nativeElement).modal('hide');
  }

  closeAddDialog(){
    if(this.addOperationInProgress){
      return;
    }
    this.resetData();
    this.closeDialog();
  }

  dayChanged(date: MonthPickEvent){
    if(date==null){
      this.day = null;
    }else{
      this.day = new Date(Date.UTC(date.year, date.month, date.day));
    }
    this.currentDay = this.day;
  }

  get expenseTypesMap(){
    return this.workTaskExpensesService.expenseTypesMap;
  }

  addNewExpense(){
    if(this.addOperationInProgress){
      return;
    }
    
    if(StringUtils.nullOrEmpty(this.title) || StringUtils.nullOrEmpty(this.expenseType) || 
        StringUtils.nullOrEmpty(this.description) ||
        this.day==null || this.amount==null){

      this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
      return;
    }

    if(this.amount < 0){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data")
      return;
    }

    let addExpenseRequest = {
      title: StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.title),
      description: StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.description),
      expenseType: StringUtils.transformToNullIfWithespaceOrNull(this.expenseType),
      day: this.day,
      amount: this.amount
    }

    this.addOperationInProgress = true;

    this.workTaskExpensesService.addNewWorkTaskExpense(addExpenseRequest)
      .subscribe(
        (succ: GenericResponse<WorkTaskExpensesDTO>)=>{
          this.addOperationInProgress = false;
          this.onSaveClick.emit(succ.data);
          this.closeAddDialog();
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.work-task-expense-added");
        },
        (err: HttpErrorResponse)=>{
          this.exceptionHandler.manageErrorWithLongChain(err.status);
          this.addOperationInProgress = false;
        }
      )
  }



}
