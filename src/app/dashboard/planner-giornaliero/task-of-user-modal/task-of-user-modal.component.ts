import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TaskOfUserService } from 'src/app/model/services/impiegato/task-of-user.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { WorkTaskDTO } from 'src/app/model/dtos/incarico/work-task-dto.model';

declare const $: any;

@Component({
  selector: 'app-task-of-user-modal',
  templateUrl: './task-of-user-modal.component.html',
  styleUrls: ['./task-of-user-modal.component.scss']
})
export class TaskOfUserModalComponent implements OnInit {

  @ViewChild("taskOfUserModal", { static: true })
  taskOfUserModal: ElementRef;

  @Output()
  onTaskSelect: EventEmitter<WorkTaskDTO> = new EventEmitter();
  
  public sortBy = new OrderEvent();

  showLoader: boolean = false;

  constructor(private taskOfUserService: TaskOfUserService, private loader: LoadingService) { }

  ngOnInit(): void {
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  } 

  openDialog(){
    this.taskOfUserService.reset();
    this.refreshWorkTask();

    $(this.taskOfUserModal.nativeElement).modal()//{backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    $(this.taskOfUserModal.nativeElement).modal('hide');
  }
  
  filtersChanged(event){
    this.refreshWorkTask();
  }

  get gestioneCommessaFilters(){
    return this.taskOfUserService.gestioneCommessaFilters;
  }

  selectTask(task: WorkTaskDTO){
    this.closeDialog();
    this.onTaskSelect.emit(task);
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.taskOfUserService.currentSortBy = event;
    this.refreshWorkTask();
  }

  get currentCommesse(){
    return this.taskOfUserService.currentLoadedCommesse;
  }

  getCurrentPageIndex(): number{
    return this.taskOfUserService.pageIndex;
  }

  getTotalRecords(): number{
    return this.taskOfUserService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.taskOfUserService.currentPageSize;
  }

  changePage(event: PaginationEvent) {
    this.taskOfUserService.pageIndex = event.selectedPage;
    this.taskOfUserService.currentPageSize = event.pageSize;
    this.refreshWorkTask();
  }

  refreshWorkTask(){
    this.showLoader = true;
    return this.taskOfUserService.loadWorkTaskOfUser().subscribe(
      succ=>{
        this.showLoader = false;
      },
      err=>{
        this.showLoader = false;
      }
    );
  }


}
