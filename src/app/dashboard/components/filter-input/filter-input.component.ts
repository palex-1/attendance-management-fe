import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConstans } from '../../../app.constants';

export interface FilterElement {
   value: string,
   identifier: any;
} 

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit {

  public static FILTER_FUNCTION_START_WITH: string = "start_with";
  public static FILTER_FUNCTION_START_WITH_IGNORE_CASE: string = "start_with_ic";
  public static FILTER_FUNCTION_CONTAINS_IGNORE_CASE: string = "contains_ic";
  public static FILTER_FUNCTION_CONTAINS: string = "contains";

  showContentListB: boolean = false;
  inputValue: string = null;
  filterInProgress: boolean = false;
  listToShow: FilterElement[];

  choosenFilteringFunction: any;

  choosenElem: FilterElement = null;

  @Input()
  elementList: FilterElement[];

  @Input()
  tooltip: string;

  @Output()
  onSelectElement: EventEmitter<FilterElement> = new EventEmitter();

  @Input()
  filterRule: string;

  


  constructor(private translate: TranslateService) { 
  }

  ngOnInit() {
    if(this.elementList!=null){
      this.listToShow =  this.elementList;
    }else{
      this.listToShow = [];
    }
    this.chooseFilterFunction(); 
  }

  chooseFilterFunction(){
    this.choosenFilteringFunction = this.executeFilterContainsIgnoreCase; //default

    if(this.filterRule==FilterInputComponent.FILTER_FUNCTION_START_WITH_IGNORE_CASE){
      this.choosenFilteringFunction = this.executeFilterStartWithIgnoreCase;
    }else{
      if(this.filterRule==FilterInputComponent.FILTER_FUNCTION_START_WITH){
        this.choosenFilteringFunction = this.executeFilterStartWith;
      }else{

      }if(this.filterRule==FilterInputComponent.FILTER_FUNCTION_CONTAINS){
        this.choosenFilteringFunction = this.executeFilterContains;
      }else{
        if(this.filterRule==FilterInputComponent.FILTER_FUNCTION_CONTAINS_IGNORE_CASE){
          this.choosenFilteringFunction = this.executeFilterContainsIgnoreCase;
        }
      }
    }
    
  }

  showContentList(){
    if(this.showContentListB==false){
      this.showContentListB = true;
    }
  }

  hideContentList(){
    this.showContentListB = false;
    if(this.choosenElem==null){
      this.executeFilter(null);
      this.inputValue = null;
    }
  }

  selectItem(elem: FilterElement){
    this.hideContentList();
    this.inputValue = elem.value;
    this.choosenElem = elem;
    this.onSelectElement.emit(elem);
  }

  get inputPlaceholder(): string{
    if(this.tooltip==null){
      return this.translate.instant("general.tooltip.value");
    }
    return this.tooltip;
  }

  filterElements(){
    let currentValue = this.inputValue;
    this.executeFilter(currentValue);
  }

  executeFilter(value: string){
    if(this.choosenElem!=null){
      this.onSelectElement.emit(null);
    }
    this.choosenElem = null;
    if(value==null){ //push all
      let park: FilterElement[] = [];
      for(let i=0; i<this.elementList.length; i++){
          park.push(this.elementList[i]);
      }
      return;
    }
    this.choosenFilteringFunction(value);
  }

  private executeFilterContains(value: string){
    if(this.elementList==null){
      return;
    }
     let park: FilterElement[] = [];
     for(let i=0; i<this.elementList.length; i++){
       if(this.elementList[i].value!=null && this.elementList[i].value.indexOf(value)>=0){
          park.push(this.elementList[i]);
       }
     }
     this.listToShow = park;
  }

  private executeFilterContainsIgnoreCase(value: string){
    if(this.elementList==null){
      return;
    }
     let park: FilterElement[] = [];
     for(let i=0; i<this.elementList.length; i++){
       if(this.elementList[i].value!=null && this.elementList[i].value.toLowerCase().indexOf(value.toLowerCase())>=0){
          park.push(this.elementList[i]);
       }
     }
     this.listToShow = park;
  }

  private executeFilterStartWith(value: string){
    if(this.elementList==null){
      return;
    }
     let park: FilterElement[] = [];
     for(let i=0; i<this.elementList.length; i++){
       if(this.elementList[i].value!=null && this.elementList[i].value.startsWith(value)){
          park.push(this.elementList[i]);
       }
     }
     this.listToShow = park;
  }
  
  private executeFilterStartWithIgnoreCase(value: string){
    if(this.elementList==null){
      return;
    }
     let park: FilterElement[] = [];
     for(let i=0; i<this.elementList.length; i++){
       if(this.elementList[i].value!=null && this.elementList[i].value.toLowerCase().startsWith(value.toLowerCase())){
          park.push(this.elementList[i]);
       }
     }
     this.listToShow = park;
  }
}
