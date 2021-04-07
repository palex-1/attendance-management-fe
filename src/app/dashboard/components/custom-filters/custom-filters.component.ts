import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { IsMobileService } from 'src/app/util/sizing/is-mobile-service.service';
import { IdGenerationService } from 'src/app/util/id-generation.service';
import { AppConstans } from 'src/app/app.constants';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MonthPickEvent } from '../monthpicker/monthpicker.component';

export class FilterElement{
  /** the identifier of filter that will be passed to the backend */
  id: any;
  /** Name that will be used in name of html form element */
  name: string;
  i18nKeyLabel: string;
  value: any | Date;
  options ?: SelectOption[]; 
  type: FilterType;
}

export class DateFilterElement extends FilterElement{
  parkDateValue ?: Date;
}

export enum FilterType {
  SELECT, CALENDAR, TEXT
}

export class SelectOption{
  id: any;
  label: string;
}

declare const $: any;

@Component({
  selector: 'app-custom-filters',
  templateUrl: './custom-filters.component.html',
  styleUrls: ['./custom-filters.component.scss']
})
export class CustomFiltersComponent implements OnInit {

  @Input()
  filtersElements: DateFilterElement[];

  @Input()
  filterChangeOnApply: boolean = true;

  @Input()
  filtersColsStyle: string = 'col-md-12';

  @Output()
  filtersChanged: EventEmitter<any> = new EventEmitter<any>();


  areCollapsedFilters: boolean = false;
  filterRequestsInProgress: number = 0;



  constructor(public isMobileService: IsMobileService,
                public idGenerationService: IdGenerationService) { }

  ngOnInit() {
    if(this.filtersElements!=null){
      for(let i=0; i<this.filtersElements.length;i++){
        if(this.filtersElements[i].type==FilterType.CALENDAR){
          this.filtersElements[i].parkDateValue = this.filtersElements[i].value;
        }
      }
    }    
  }

  resetFilters(){
    if(this.filtersElements!=null){
      this.filtersElements.forEach(element => {
        element.value = null;
        element.parkDateValue = null;
      });
    }

    if(this.filterChangeOnApply!=true){
      this.collectAllFilterChanged();
    }else{
      this.filtersChanged.emit("reset");
    }
  }

  applyFilters(){
    if(this.filterChangeOnApply!=true){
      this.collectAllFilterChanged();
    }else{
      this.filtersChanged.emit("change");
    }
  }

  filterChanged(elem ?: FilterElement){
    if(this.filterChangeOnApply!=true){
      this.collectAllFilterChanged();
    }    
  }

  collectAllFilterChanged(){
    this.filterRequestsInProgress++;
    let that = this;
    setTimeout(function () {
        if (that.filterRequestsInProgress <= 1) {
            that.filtersChanged.emit("change");
        }
        that.filterRequestsInProgress--;
    }, AppConstans.FilterChangeColletion_TIME);
  }

  isTxtFilterType(elem: FilterElement): boolean{
    if(elem==null){
      return false;
    }
    return elem.type==FilterType.TEXT;
  }

  isSelectFilterType(elem: FilterElement): boolean{
    if(elem==null){
      return false;
    }
    return elem.type==FilterType.SELECT;
  }

  isCalendarFilterType(elem: FilterElement): boolean{
    if(elem==null){
      return false;
    }
    return elem.type==FilterType.CALENDAR;
  }

  onChangeDateFilter(event: MonthPickEvent, elem: DateFilterElement){
    let parkDate = null;
    
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }

    elem.value = parkDate;
    this.dateFilterChangeFire();
  }


  private dateFilterChangeFire(){
    if(this.filterChangeOnApply!=true){
      this.collectAllFilterChanged();
    }
  }

}
