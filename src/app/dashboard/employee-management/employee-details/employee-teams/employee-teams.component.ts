import { Component, OnInit, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { EmployeeTeamsService } from 'src/app/model/services/impiegato/employee-teams.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { PaginationEvent } from 'src/app/dashboard/components/custom-paginator/custom-paginator.component';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-employee-teams',
  templateUrl: './employee-teams.component.html',
  styleUrls: ['./employee-teams.component.scss']
})
export class EmployeeTeamsComponent implements OnInit {
  
  public sortBy = new OrderEvent();

  constructor(private employeeTeamsService: EmployeeTeamsService, private activatedRoute: ActivatedRoute,
                private loader: LoadingService, private location : PlatformLocation) { 
  }

  ngOnInit(): void {
    
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  } 

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.employeeTeamsService.currentSortBy = event;
    this.refreshData();
  }

  filtersChanged(event){
    this.refreshData();
  }
  
  getCurrentPageIndex(): number{
    return this.employeeTeamsService.pageIndex;
  }

  getTotalRecords(): number{
    return this.employeeTeamsService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.employeeTeamsService.currentPageSize;
  }

  refreshData(){
    this.loader.startLoading();

    this.employeeTeamsService.loadInitialInformation(this.activatedRoute.snapshot.params, true).subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.employeeTeamsService.pageIndex = event.selectedPage;
    this.employeeTeamsService.currentPageSize = event.pageSize;
    this.refreshData();
  }


  get currentTasks(){
    if(this.employeeTeamsService.currentLoadedCommesse==null){
      return [];
    }
    return this.employeeTeamsService.currentLoadedCommesse;
  }

  get tasksFilters(){
    return this.employeeTeamsService.tasksFilters;
  }


}
