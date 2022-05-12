import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';
import { NgbDate, NgbDateStruct, NgbCalendar, NgbDatepickerConfig, NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap';
import { IsMobileService } from '../../util/sizing/is-mobile-service.service';
import { CompletedTaskOfDayService } from 'src/app/model/services/incarico/completed-task-of-day.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { CompletedTaskDTO } from 'src/app/model/dtos/incarico/completed-task.dto';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { forkJoin } from 'rxjs';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { SpecialTaskConfigDTO } from 'src/app/model/dtos/incarico/special-task-config.model';
import { TaskOfUserModalComponent } from './task-of-user-modal/task-of-user-modal.component';
import { WorkTaskDTO } from 'src/app/model/dtos/incarico/work-task-dto.model';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { FoodVoucherRequestDTO } from 'src/app/model/dtos/incarico/food-voucher-request.model';

const OVERTIME_COLOR = '#17a2b8';
const WORKED_HOURS_COLOR = '#28a745';
const MULTIPLE_TASKS_COLOR = '#FC0FC0';

export interface DayWorkedDetails{
    workedHours: number;
    colors: string[];
}

@Component({
  selector: 'app-planner-giornaliero',
  templateUrl: './planner-giornaliero.component.html',
  styleUrls: ['./planner-giornaliero.component.scss'],
  providers: [NgbDatepickerConfig]
})
export class PlannerGiornalieroComponent implements OnInit {

  @ViewChild('findEnabledTaskOfUser', { static: false })
  findEnabledTaskOfUser: TaskOfUserModalComponent;
  
  public sortBy = new OrderEvent();

  model: NgbDateStruct;

  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  taskCodeToAdd: string = '';
  descriptionActivityToAdd: string = '';
  totalHoursTaskToAdd: number = 0;
  currentTaskToAddSmartWorked: boolean = false;

  addTaskOperationInProgress: boolean = false;
  deleteOperationInProgress: boolean = false;

  mappaGiorniLavoratiMensili = {};

  refreshingTask: boolean = false;

  isInCurrentDayFoodVoucherRequested: boolean = false;
  savingFoodVoucherRequests: boolean = false;

  isSelectedWorkTransferNational: boolean = false;
  isSelectedWorkTransferInternational: boolean = false;
  savingWorkTransferRequests: boolean = false;


  constructor(private calendar: NgbCalendar, private config: NgbDatepickerConfig, private loader: LoadingService,
                public isMobileService: IsMobileService, private completedTaskOfDateService: CompletedTaskOfDayService,
                  private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                    private confirmer: CustomConfirmationService) {

    config.markDisabled = (date: NgbDateStruct) => {
      return this.isNonAssunto(date);
    }
  }

  isDisabled = (date: NgbDate, current: {month: number}) => date.month !== current.month;


  openFindEnabledTaskDialog(){
    this.findEnabledTaskOfUser.openDialog();
  }

  ngOnInit() {
    this.recalculateFoodVoucherCheckBox();
    this.recreateStructureOfWorkedDays();
    this.recalculateWorkTransferRequestCheckbox();
  }

  get foodVoucherAreEnabled(){
    return this.completedTaskOfDateService.foodVoucherAreEnabled;
  }

  switchFoodVoucherRequest(){
    this.isInCurrentDayFoodVoucherRequested = !this.isInCurrentDayFoodVoucherRequested;
  }

  recalculateFoodVoucherCheckBox(){
    this.isInCurrentDayFoodVoucherRequested = false;
    if(this.completedTaskOfDateService.currentFoodVoucherRequest!=null){
      this.isInCurrentDayFoodVoucherRequested = true;
    }
  }

  recalculateWorkTransferRequestCheckbox(){
    this.isSelectedWorkTransferNational = false;
    this.isSelectedWorkTransferInternational = false;
    if(this.completedTaskOfDateService.currentWorkTransferRequest!=null){
      if(this.completedTaskOfDateService.currentWorkTransferRequest.type=='NATIONAL'){
        this.isSelectedWorkTransferNational = true;
      }
      if(this.completedTaskOfDateService.currentWorkTransferRequest.type=='INTERNATIONAL'){
        this.isSelectedWorkTransferInternational = true;
      }
    }
  }

  saveFoodVoucherRequestChanges(){
    if(this.savingFoodVoucherRequests){
      return;
    }
    if(this.isInCurrentDayFoodVoucherRequested && this.completedTaskOfDateService.currentFoodVoucherRequest==null){
      //add food voucher request
      this.addCurrentVoucherRequest();
      return;
    }
    if(!this.isInCurrentDayFoodVoucherRequested && this.completedTaskOfDateService.currentFoodVoucherRequest!=null){
      //remove food voucher request
      this.removeCurrentVoucherRequest();
      return;
    }
  }

  private removeCurrentVoucherRequest(){
    this.savingFoodVoucherRequests = true;
    this.loader.startLoading();
    
    this.completedTaskOfDateService.deleteFoodVoucherRequest().subscribe(
      succ=>{
        this.savingFoodVoucherRequests = false;
        this.recalculateFoodVoucherCheckBox();
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.food-request-removed");
      },
      (err: HttpErrorResponse)=>{
        this.savingFoodVoucherRequests = false;
        this.manageErrorOnFoodVoucherRemoveRequest(err);  
        this.loader.endLoading();  
        this.recalculateFoodVoucherCheckBox(); 
      }
    )

  }

  manageErrorOnFoodVoucherRemoveRequest(err: HttpErrorResponse) {
    let subcode = err.error.subcode;

    if(err.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
      if(subcode==StandardErrorCode.USER_IS_NOT_AN_EMPLOYEE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-is-not-an-employee-in-this-date");
        return;
      }
    }
    
    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }


  private addCurrentVoucherRequest(){
    this.savingFoodVoucherRequests = true;

    this.completedTaskOfDateService.addFoodVoucherRequest().subscribe(
      succ=>{
        this.savingFoodVoucherRequests = false;
        this.recalculateFoodVoucherCheckBox();
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.food-request-added");
      },
      (err: HttpErrorResponse)=>{
        this.savingFoodVoucherRequests = false;
        this.manageErrorOnFoodVoucherAddRequest(err);
        this.loader.endLoading();
        this.recalculateFoodVoucherCheckBox();
      }
    )
  }

  manageErrorOnFoodVoucherAddRequest(err: HttpErrorResponse) {
    let subcode = err.error.subcode;

    if(err.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
      if(subcode==StandardErrorCode.NOT_ENOUGHT_WORKED_HOURS_TO_REQUEST_FOOD_VOUCHER){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.not-enought-hours-to-request-food-voucher");
        return;
      }
    }
    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }

  switchSmartworked(){
    if(this.addTaskOperationInProgress){
      return;
    }
    this.currentTaskToAddSmartWorked = !this.currentTaskToAddSmartWorked;
  }

  onDateSelection(date: NgbDate) {
    this.completedTaskOfDateService.currentSelectedDay = new Date(Date.UTC(date.year, date.month - 1, date.day));
    this.refreshCompletedTaskOfDay();
  }

  get currentSelectedDay(){
    return this.completedTaskOfDateService.currentSelectedDay;
  }

  onMonthChange(event: NgbDatepickerNavigateEvent){
    if(this.refreshingTask){
      return;
    }

    if(event.current==null || event.current.year==null || event.current.month==null){
      return; //is the first change fired when the component is initialized
    }
    if(event.next==null|| event.next.year==null || event.next.month==null){
      return; //cannot select an invalid date
    }
    if(event.next.year==event.current.year && event.next.month==event.current.month){
      return; //nothing changed
    }

    
    this.completedTaskOfDateService.currentSelectedDay = new Date(Date.UTC(event.next.year, event.next.month - 1, 1));

    this.loader.startLoading();
    this.refreshingTask = true;

    this.completedTaskOfDateService.reloadAllCompletedTasksOfMonth().subscribe(
      succ=>{
        this.recreateStructureOfWorkedDays();
        this.recalculateFoodVoucherCheckBox();
        this.recalculateWorkTransferRequestCheckbox();
        this.refreshingTask = false;
        this.loader.endLoading();
      },
      err=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    );
  }

  canDeleteCompletedTask(task: CompletedTaskDTO){
    if(task==null){
      return false;
    }
    return task.editable;
  }

  deleteCompletedTask(task: CompletedTaskDTO){
    if(this.deleteOperationInProgress){
      return;
    }
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback(
      "message.sure-to-delete-completed-task", ()=>{that.executeTaskDelete(task)}
    );

  }

  executeTaskDelete(task: CompletedTaskDTO){
    this.deleteOperationInProgress = true;
    this.loader.startLoading();

    this.completedTaskOfDateService.deleteCompletedTask(task)
    .subscribe(
      succ=>{
        this.recreateStructureOfWorkedDaysForTaskDelete(task);
        this.deleteOperationInProgress = false;
        this.loader.endLoading();
        this.refreshCompletedTaskOfDay();
        this.reloadFoodRequestAfterTaskDelete();
      },
      (err: HttpErrorResponse)=>{
        this.deleteOperationInProgress = false;
        this.manageErrorOnDeleteWorkedTask(err);
        this.loader.endLoading();
      }
    )
  }


  reloadFoodRequestAfterTaskDelete(){
    this.loader.startLoading();

    let wasRequested = this.isInCurrentDayFoodVoucherRequested;

    this.completedTaskOfDateService.loadFoodVoucherRequestOfSelectedDay().subscribe(
      (succ: GenericResponse<FoodVoucherRequestDTO>)=>{

        if(wasRequested && succ.data==null){
          this.notifier.notifyWarningWithI18nAndStandardTitle("message.food-voucher-was-removed")
          this.recalculateFoodVoucherCheckBox();
        }

        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    )
  }

  

  manageErrorOnDeleteWorkedTask(err: HttpErrorResponse) {
    let subcode = err.error.subcode;

    if(err.status==ChainExceptionHandler.NOT_FOUND){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.work-task-completed-not-found");
      return;
    }

    if(err.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      if(subcode==StandardErrorCode.THIS_TASK_IS_NOT_EDITABLE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.task-not-editable");
        return;
      }
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
    }


    this.exceptionHandler.manageErrorWithLongChain(err.status)
  }

  selectedTask(task: WorkTaskDTO){
    if(this.addTaskOperationInProgress){
      return;
    }
    if(task!=null){
      this.taskCodeToAdd = task.taskCode;
    }
  }

  clearAddNewCompletedTaskForm(){
    this.taskCodeToAdd = '';
    this.totalHoursTaskToAdd = 0;
    this.currentTaskToAddSmartWorked = false;
    this.descriptionActivityToAdd = '';
  }

  addWorkTask(){
    if(this.addTaskOperationInProgress){
      return;
    }

    if(this.taskCodeToAdd==null || this.taskCodeToAdd.trim()=='' || this.currentTaskToAddSmartWorked==null 
        || this.totalHoursTaskToAdd==null || this.totalHoursTaskToAdd<=0 || !Number.isInteger(this.totalHoursTaskToAdd)
        || this.totalHoursTaskToAdd>24){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.invalid-data");
        return;
    }

    this.loader.startLoading();

    this.addTaskOperationInProgress = true;

    this.completedTaskOfDateService.addNewWorkedTask(this.taskCodeToAdd, this.currentTaskToAddSmartWorked, 
      this.totalHoursTaskToAdd, this.completedTaskOfDateService.currentSelectedDay,
        this.descriptionActivityToAdd).subscribe(
        succ=>{

          succ.data.day = DateUtils.buildDateFromStrOrDate(succ.data.day);
          this.recreateStructureOfWorkedDaysForTaskAdd(succ.data);

          this.loader.endLoading();
          if(succ.subcode==StandardErrorCode.UPDATED_AN_ALREADY_ADDED_TASK){
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.completed-task-already-added-updated")
          }else{
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.completed-task-added-successfully")
          }
          this.addTaskOperationInProgress = false;
          this.clearAddNewCompletedTaskForm();
        },
        (err: HttpErrorResponse)=>{
          this.addTaskOperationInProgress = false;
          this.manageErrorOnAddWorkedTaskFailed(err);
          this.loader.endLoading();
          
        }
      )

  }

  manageErrorOnAddWorkedTaskFailed(err: HttpErrorResponse) {
    let subcode = err.error.subcode;

    if(err.status==ChainExceptionHandler.NOT_FOUND){
      if(subcode==StandardErrorCode.WORK_TASK_NOT_FOUND){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.work-task-not-found");
        return;
      }
    }

    if(err.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      if(subcode==StandardErrorCode.USER_IS_NOT_PART_OF_THE_TEAM){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-is-not-part-of-the-team");
        return;
      }
      if(subcode==StandardErrorCode.TOTAL_WORKED_HOURS_REACHES_THE_LIMIT){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.total-worked-hours-reached-day-limit");
        return;
      }
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
      if(subcode==StandardErrorCode.TASK_IN_NOT_YET_ENABLED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.task-is-disabled");
        return;
      }
      if(subcode==StandardErrorCode.USER_IS_NOT_AN_EMPLOYEE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-is-not-an-employee-in-this-date");
        return;
      }
      if(subcode==StandardErrorCode.TOO_MUCH_ABSENCE_TASK_ADDED_IN_THIS_DAY){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.too-much-absence-task");
        return;
      }
      
    }


    this.exceptionHandler.manageErrorWithLongChain(err.status)
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.completedTaskOfDateService.currentSortBy = event;
    this.refreshCompletedTaskOfDay();
  }

  filtersChanged(event){
    this.refreshCompletedTaskOfDay();
  }
  
  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  getCurrentPageIndex(): number{
    return this.completedTaskOfDateService.pageIndex;
  }

  getTotalRecords(): number{
    return this.completedTaskOfDateService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.completedTaskOfDateService.currentPageSize;
  }


  refreshCompletedTaskOfDay(){
    this.loader.startLoading();

    this.completedTaskOfDateService.reloadAllCompletedTasksOfDay().subscribe(
      succ=>{
        this.recalculateFoodVoucherCheckBox();
        this.recalculateWorkTransferRequestCheckbox();
        this.loader.endLoading();
      },
      err=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.completedTaskOfDateService.pageIndex = event.selectedPage;
    this.completedTaskOfDateService.currentPageSize = event.pageSize;
    this.refreshCompletedTaskOfDay();
  }
  
  get currentLoadedTasks(): CompletedTaskDTO[]{
    if(this.completedTaskOfDateService.currentLoadedTasks==null){
      return [];
    }
    return this.completedTaskOfDateService.currentLoadedTasks;
  }



  private recreateStructureOfWorkedDaysForTaskAdd(task: CompletedTaskDTO){
    if(this.completedTaskOfDateService.completedTaskOfMonth==null){
      this.completedTaskOfDateService.completedTaskOfMonth = [];
    }
    this.completedTaskOfDateService.completedTaskOfMonth.push(task);
    this.recreateStructureOfWorkedDays();
  }

  private recreateStructureOfWorkedDaysForTaskDelete(task: CompletedTaskDTO){
    let found: boolean = false;

    for(let i=0; i<this.completedTaskOfDateService.completedTaskOfMonth.length && !found; i++){
      if(this.completedTaskOfDateService.completedTaskOfMonth[i].id==task.id){
        this.completedTaskOfDateService.completedTaskOfMonth.splice(i, 1);
        found = true;
      }
    }
    this.recreateStructureOfWorkedDays();
  }


  get specialTasksConfigs(): SpecialTaskConfigDTO[]{
    if(this.completedTaskOfDateService.specialTasksConfig==null){
      return [];
    }
    return this.completedTaskOfDateService.specialTasksConfig;
  }
  

  isSelected(day){
    if(this.currentSelectedDay!=null && this.currentSelectedDay.getDate()==day){
      return true;
    }
    return false;
  }

  getColorOfDay(day){
    if(this.refreshingTask){
      return null;
    }
    if(this.mappaGiorniLavoratiMensili[day]!=null && this.mappaGiorniLavoratiMensili[day].colors!=null ){
        
      if(this.mappaGiorniLavoratiMensili[day].colors.length>0){
        if(this.mappaGiorniLavoratiMensili[day].colors.length>1){
          return MULTIPLE_TASKS_COLOR;
        }
        return this.mappaGiorniLavoratiMensili[day].colors[0];
      }else{
        let hoursToWorkForUser = this.getHoursToWorkForUser();
        if(hoursToWorkForUser!=null){
          if(this.mappaGiorniLavoratiMensili[day].workedHours==hoursToWorkForUser){
            return WORKED_HOURS_COLOR; //tutte le ore lavorate
          }
          if(this.mappaGiorniLavoratiMensili[day].workedHours>hoursToWorkForUser){
            return OVERTIME_COLOR; //straordinario
          }
        }
        
      }
    }
    return null;
  }

  private getHoursToWorkForUser(): number{

    if(this.completedTaskOfDateService.userProfileContract!=null){
      return this.completedTaskOfDateService.userProfileContract.workDayHours;
    }
    return null;
  }

  private recreateStructureOfWorkedDays(){
    this.mappaGiorniLavoratiMensili = {};

    if(this.completedTaskOfDateService.completedTaskOfMonth.length==0){
      return;
    }

    for(let i=0; i<this.completedTaskOfDateService.completedTaskOfMonth.length; i++){
      let date = this.completedTaskOfDateService.completedTaskOfMonth[i].day;
      let currentTask: CompletedTaskDTO = this.completedTaskOfDateService.completedTaskOfMonth[i];
      let color = this.getColorOfTask(currentTask);
      
      let day = date.getUTCDate();
      let parkStr = day;

      let oldValue = this.mappaGiorniLavoratiMensili[parkStr];

      if(oldValue==null){
        let colors: string[] = color==null ? []: [color];
        let value: DayWorkedDetails = {workedHours: currentTask.workedHours, colors: colors};

        this.mappaGiorniLavoratiMensili[parkStr] = value;
      }else{
        let colors: string[] = oldValue.colors;
        if(color!=null && !colors.includes(color)){
          colors = colors.concat(color);
        }

        let value: DayWorkedDetails = {workedHours: oldValue.workedHours + currentTask.workedHours, colors: colors};
        this.mappaGiorniLavoratiMensili[parkStr] = value;
      }
    }

    //console.log(this.mappaGiorniLavoratiMensili)
  }


  private getColorOfTask(task: CompletedTaskDTO){
    for(let i=0; i<this.specialTasksConfigs.length; i++){
      if(this.specialTasksConfigs[i].taskCode==task.taskCode.taskCode){
        return this.specialTasksConfigs[i].hexColor;
      }
    }

    return null;
  }



  isNonAssunto(date: NgbDateStruct){
    if(date==null || date.day==null || date.month==null || date.year==null){
      return false;
    }

    let park: Date = new Date(date.year, date.month, date.day, 23, 59, 1);

    if(this.completedTaskOfDateService.userProfileContract==null || 
          this.completedTaskOfDateService.userProfileContract.hiringDate==null){
      return true;
    }

    return park<this.completedTaskOfDateService.userProfileContract.hiringDate;
  }


  switchWorkTransferNationalRequest(){
    this.isSelectedWorkTransferNational = !this.isSelectedWorkTransferNational;
    if(this.isSelectedWorkTransferNational){
      this.isSelectedWorkTransferInternational = false;
    }
  }

  switchWorkTransferInternationalRequest(){
    this.isSelectedWorkTransferInternational = !this.isSelectedWorkTransferInternational;
    if(this.isSelectedWorkTransferInternational){
      this.isSelectedWorkTransferNational = false;
    }
  }

  saveWorkTransferRequestChanges(){
    if(this.savingWorkTransferRequests){
      return;
    }
    let isSelectedOneOption = this.isSelectedWorkTransferInternational || this.isSelectedWorkTransferNational;

    //add
    if(isSelectedOneOption && this.completedTaskOfDateService.currentWorkTransferRequest==null){
      this.addOrUpdateCurrentWorkTransferRequest(false);
      return;
    }

    //update
    if(isSelectedOneOption && this.completedTaskOfDateService.currentWorkTransferRequest!=null){
      if(this.completedTaskOfDateService.currentWorkTransferRequest.type=='NATIONAL' && this.isSelectedWorkTransferInternational){
        this.isSelectedWorkTransferNational = true;
        this.addOrUpdateCurrentWorkTransferRequest(true);
      }
      if(this.completedTaskOfDateService.currentWorkTransferRequest.type=='INTERNATIONAL' && this.isSelectedWorkTransferNational){
        this.isSelectedWorkTransferNational = true;
        this.addOrUpdateCurrentWorkTransferRequest(true);
      }
    }

    //delete
    if(!isSelectedOneOption && this.completedTaskOfDateService.currentWorkTransferRequest!=null){
      this.removeCurrentWorkTransferRequest();
      return;
    }
  }

  private removeCurrentWorkTransferRequest(){
    this.savingWorkTransferRequests = true;
    this.loader.startLoading();
    
    this.completedTaskOfDateService.deleteWorkTransferRequest().subscribe(
      succ=>{
        this.loader.endLoading();
        this.savingWorkTransferRequests = false;
        this.recalculateWorkTransferRequestCheckbox();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.work-transfer-removed");
      },
      (err: HttpErrorResponse)=>{
        this.loader.endLoading();
        this.savingWorkTransferRequests = false;
        this.manageErrorOnWorkTransferRequestRemoval(err);
        this.recalculateWorkTransferRequestCheckbox(); 
      }
    )

  }

  manageErrorOnWorkTransferRequestRemoval(err: HttpErrorResponse) {
    let subcode = err.error.subcode;

    if(err.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
    }
    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }

  private addOrUpdateCurrentWorkTransferRequest(isAnUpdate: boolean){
    this.savingWorkTransferRequests = true;

    let type: string = null;

    if(this.isSelectedWorkTransferNational){
      type = 'NATIONAL';
    }

    if(this.isSelectedWorkTransferInternational){
      type = 'INTERNATIONAL';
    }

    this.loader.startLoading();

    this.completedTaskOfDateService.addOrUpdateWorkTransferRequest(type).subscribe(
      succ=>{
        this.loader.endLoading();
        this.savingWorkTransferRequests = false;
        this.recalculateWorkTransferRequestCheckbox();
        if(isAnUpdate){
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.work-task-request-updated");
        }else{
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.work-task-request-added");
        }
        
      },
      (err: HttpErrorResponse)=>{
        this.loader.endLoading();
        this.savingWorkTransferRequests = false;
        this.manageErrorOnWorkTransferRequestAddition(err);
        this.recalculateWorkTransferRequestCheckbox();
      }
    )
  }

  manageErrorOnWorkTransferRequestAddition(err: HttpErrorResponse) {
    let subcode = err.error.subcode;

    if(err.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
      if(subcode==StandardErrorCode.USER_IS_NOT_AN_EMPLOYEE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-is-not-an-employee-in-this-date");
        return;
      }
    }
    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }

}
