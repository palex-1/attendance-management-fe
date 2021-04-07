import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { EmployeeManagementService } from 'src/app/model/services/impiegato/employee-management.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { AddTeamMemberModalComponent } from '../gestione-commesse/add-team-member-modal/add-team-member-modal.component';
import { UserProfileDTO } from 'src/app/model/dtos/profile/user-profile.dto';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { FileUtilityService } from 'src/app/util/file-utility.service';
import { AddNewEmployeeComponent } from './add-new-employee/add-new-employee.component';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {

  @ViewChild('addMemberModalRef', { static: false })
  addMemberModalRef: AddNewEmployeeComponent;
  
  public sortBy = new OrderEvent();

  constructor(private loader: LoadingService, private employeeManagementService: EmployeeManagementService,
                private authoritiesService: AuthoritiesService, private router: Router, 
                  private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                    private fileUtilitySrv: FileUtilityService) { 

  }

  ngOnInit() {
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  } 

  enableUserProfile(user: UserProfileDTO){
    this.loader.startLoading();

    this.employeeManagementService.sendEnableUserAccount(user)
    .subscribe(
      succ=>{
        user.accountDisabled = false;
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle('message.enabled-user-profile')
      },
      err=>{
        this.manageErrorOnLockUnlockProfile(err);
        this.loader.endLoading();
      }
    )
  }

  disableUserProfile(user: UserProfileDTO){
    this.loader.startLoading();

    this.employeeManagementService.sendDisableUserAccount(user)
    .subscribe(
      succ=>{
        user.accountDisabled = true;
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle('message.disables-user-profile')
      },
      err=>{
        this.manageErrorOnLockUnlockProfile(err);
        this.loader.endLoading();
      }
    )
  }

  private manageErrorOnLockUnlockProfile(err: HttpErrorResponse){
    if(err.status==ChainExceptionHandler.NOT_ACCEPTABLE){
      if(err.error.subcode==StandardErrorCode.USER_CANNOT_DISABLE_ENABLE_HIMSELF){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-cannot-enable-disable-himself")
        return;
      }
    }
    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.employeeManagementService.currentSortBy = event;
    this.refreshEmployees();
  }
  
  openAddDialog(){
    this.addMemberModalRef.openDialog();
  }

  onAddNewEmployee(employee: UserProfileDTO){
    if(employee!=null){
      this.employeeManagementService.pushOnTopEmployees(employee);
    }
  }

  openDetails(employee: UserProfileDTO){
    this.router.navigateByUrl("dashboard/employee/"+employee.id)
  }

  resetFilters(){
    this.employeeManagementService.resetFilters();
    this.refreshEmployees();
  }

  filtersChanged(){
    this.refreshEmployees();
  }
  
  getCurrentPageIndex(): number{
    return this.employeeManagementService.pageIndex;
  }

  getTotalRecords(): number{
    return this.employeeManagementService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.employeeManagementService.currentPageSize;
  }

  refreshEmployees(){
    this.loader.startLoading();

    this.employeeManagementService.loadAllEmployees().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.employeeManagementService.pageIndex = event.selectedPage;
    this.employeeManagementService.currentPageSize = event.pageSize;
    this.refreshEmployees();
  }
  
  
  get employees(): UserProfileDTO[]{
    return this.employeeManagementService.currentLoadedUserData;
  }


  get fiscalCodeFilter(){
    return this.employeeManagementService.fiscalCodeFilter;
  }

  set fiscalCodeFilter(value: string){
    this.employeeManagementService.fiscalCodeFilter = value;
  }

  get nameFilter(){
    return this.employeeManagementService.nameFilter;
  }

  set nameFilter(value: string){
    this.employeeManagementService.nameFilter = value;
  }

  get surnameFilter(){
    return this.employeeManagementService.surnameFilter;
  }

  set surnameFilter(value: string){
    this.employeeManagementService.surnameFilter = value;
  }

  
  get phoneNumberFilter(){
    return this.employeeManagementService.phoneNumberFilter;
  }

  set phoneNumberFilter(value: string){
    this.employeeManagementService.phoneNumberFilter = value;
  }
  
  get emailFilter(){
    return this.employeeManagementService.emailFilter;
  }

  set emailFilter(value: string){
    this.employeeManagementService.emailFilter = value;
  }
}
