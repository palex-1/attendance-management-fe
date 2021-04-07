import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class MonthPickEvent {
  year: number;
  month: number;
  day ?: number;
}

export class DayElement {
  isOldMonth: boolean = false;
  isNewMonth: boolean = false;
  value: number;
  date: Date;
}

@Component({
  selector: 'app-monthpicker',
  templateUrl: './monthpicker.component.html',
  styleUrls: ['./monthpicker.component.scss']
})
export class MonthpickerComponent implements OnInit, OnChanges {

  showContentListB: boolean = false;
  inputValue: string = null;

  private REGEX: RegExp= /^[0-9]{2}\/[0-9]{2}\/[0-9]{2,4}$/
  private REGEX_MOTHPICKER: RegExp= /^[0-9]{2}\/[0-9]{2,4}$/

  private SEPARATOR: string = '-';

  @Input()
  placeholder: string;

  @Input()
  tooltip: string;

  @Input()
  isAMonthpicker: boolean;

  @Output()
  onSelectDate: EventEmitter<MonthPickEvent> = new EventEmitter();

  @Input()
  initialValue: Date;

  @Input()
  disabled: boolean;

  currentWeekDays: DayElement[][] = [];

  private startYearInternal: number = 0;
  
  
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = 0;

  showMonth: boolean = false;
  showDays: boolean = true;
  private daySelected: DayElement = null;
  private currentYears: number[] = [];

  private currentDateSelected: Date = null;
  private isAMonthpickerInternal: boolean = false;
  private initializingComponent: boolean = false;

  constructor(private translate: TranslateService) { 
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.initializingComponent){
      return;
    }
    if(changes.initialValue!=null && changes.initialValue.previousValue!=changes.initialValue.currentValue){
      //if date is changed
      if(this.currentDateSelected!=changes.initialValue.currentValue){
        this.initializeComponent();
      }      
    }
  }
  
  ngOnInit() {
    this.initializeComponent();
  }

  //called from ext
  resetComponent(){
    this.initializeComponent();
  }

  private initializeComponent(){
    if(this.initializingComponent){
      return;
    }
    this.initializingComponent = true;

    let initialValueInvalid = false;

    if(this.initialValue==null || !(this.initialValue instanceof Date || typeof(this.initialValue)=='string')){
      initialValueInvalid = true;
      this.currentDateSelected = new Date();
    }else{
      initialValueInvalid = false;
      let parkDate = new Date(this.initialValue)
      this.currentDateSelected = new Date(parkDate.getUTCFullYear(), parkDate.getUTCMonth(), parkDate.getUTCDate(),
                                  parkDate.getUTCHours(), parkDate.getUTCMinutes(), parkDate.getUTCSeconds());
    }

    this.isAMonthpickerInternal = this.isAMonthpicker==true;
    this.initStartDate();
    this.buildYearsBlock();

    if(this.isAMonthpicker){
      this.switchToMonthPicker()
    }else{
      this.rebuildDaysStructure();

      this.findDaySelected()
    }

    this.clearInputValue();

    if(!initialValueInvalid){
      this.buildInputValue();
    }else{
      this.daySelected = null;
    }

    this.initializingComponent = false;
  }


  findDaySelected(){
    let found: boolean = false;
    let dateToSelect: Date = new Date(this.currentDateSelected)

    for(let i=0; i<this.currentWeekDays.length && !found; i++){
      for(let j=0; j<this.currentWeekDays[i].length && !found ;j++){
        if(this.currentWeekDays[i][j].date.getMonth()==dateToSelect.getMonth() && 
              this.currentWeekDays[i][j].date.getFullYear()==dateToSelect.getFullYear() && 
                this.currentWeekDays[i][j].date.getDate() == dateToSelect.getDate()){
                  this.daySelected = this.currentWeekDays[i][j];
                  found=true;
              }
      }
    }
  }

  isThisDaySelected(day: DayElement){
    return this.daySelected==day;
  }

  selectThisDay(day: DayElement){
    this.daySelected = day;
    this.currentDateSelected = day.date;
    this.selectedYear = this.currentDateSelected.getFullYear();
    this.selectedMonth = this.currentDateSelected.getMonth();
    this.buildInputValue();
    this.fireValueChange();
    this.hideContentList();
  }

  private initStartDate(){
    this.selectedYear = this.currentDateSelected.getFullYear();
    this.startYearInternal = this.selectedYear;
    this.selectedMonth = this.currentDateSelected.getMonth();
  }

  private buildYearsBlock(){
    this.currentYears = [];
    let start = this.startYearInternal - 6;
    let toAdd = 0;
    if(start<0){
      toAdd = start*-1;
      start = 0;
    }
    for(let i=start; i <this.startYearInternal + 6 + toAdd; i++){
      this.currentYears.push(i);
    }
  }

  switchToMonthPicker(){
    this.showMonth = true;
    this.showDays = false;
  }
  
  switchToDayPicker(){
    this.showMonth = false;
    this.showDays = true;
  }

  resetSelectedYearAndMonth(){
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = 0;
    this.startYearInternal = this.selectedYear;
    this.buildYearsBlock();
  }

  inputValueChanged(){
    if(this.isAMonthpickerInternal){
      this.inputValueChangeForMonthPicker()
    }else{
      this.inputValueChangeForDatePicker()
    }
  }

  private inputValueChangeForMonthPicker(){
    if(this.inputValue!=null && this.REGEX_MOTHPICKER.test(this.inputValue)){
      let value = this.inputValue.split('/');

      this.selectedYear = parseInt(value[1]);
      this.selectedMonth = parseInt(value[0]) - 1;

      if(this.selectedMonth>11 || this.selectedMonth<0){
        this.selectedMonth = 0;
      }

      if(this.selectedYear<0){
        this.selectedYear = new Date().getFullYear();
      }
      this.currentDateSelected = new Date(this.selectedYear, this.selectedMonth, 1);

      this.startYearInternal = this.selectedYear;
      this.buildYearsBlock();
      this.buildInputValue();
      this.fireValueChange();

    }else{
      this.inputValue = '';
      this.onSelectDate.emit(null);
      this.resetSelectedYearAndMonth();
    }
  }

  private inputValueChangeForDatePicker(){
    if(this.inputValue!=null && this.REGEX.test(this.inputValue)){
      let value = this.inputValue.split('/');

      this.selectedYear = parseInt(value[2]);
      this.selectedMonth = parseInt(value[1]) - 1;
      let selectedDay = parseInt(value[0])

      if(this.selectedMonth>11 || this.selectedMonth<0){
        this.selectedMonth = 0;
      }

      if(this.selectedYear<0){
        this.selectedYear = new Date().getFullYear();
      }
      if(selectedDay<0){
        selectedDay = 1;
      }

      this.currentDateSelected = new Date(this.selectedYear, this.selectedMonth, selectedDay);

      this.startYearInternal = this.selectedYear;
      this.buildYearsBlock();
      this.buildInputValue();
      this.fireValueChange();

    }else{
      this.inputValue = '';
      this.onSelectDate.emit(null);
      this.resetSelectedYearAndMonth();
    }
  }

  onTypeValue(){
    if(this.isAMonthpickerInternal){
      this.onTypeValueChangeForMonthPicker()
    }else{
      this.onTypeValueChangeForDatePicker()
    }
  }

  onTypeValueChangeForMonthPicker(){
    if(this.inputValue!=null && this.REGEX_MOTHPICKER.test(this.inputValue)){
      let value = this.inputValue.split('/');

      let prevMonth = this.selectedMonth;
      let prevYear = this.selectedYear;

      this.selectedYear = parseInt(value[1]);
      this.selectedMonth = parseInt(value[0]) - 1;

      if(this.selectedMonth>11 || this.selectedMonth<0){
        this.selectedMonth = 0;
      }

      if(this.selectedYear<0){
        this.selectedYear = new Date().getFullYear();
      }
      this.currentDateSelected = new Date(this.selectedYear, this.selectedMonth, 1);

      this.startYearInternal = this.selectedYear;
      this.buildYearsBlock();
      this.buildInputValue();

      this.fireValueChange();

    }
  }

  onTypeValueChangeForDatePicker(){
    if(this.inputValue!=null && this.REGEX.test(this.inputValue)){
      let value = this.inputValue.split('/');

      let prevMonth = this.selectedMonth;
      let prevYear = this.selectedYear;

      this.selectedYear = parseInt(value[2]);
      this.selectedMonth = parseInt(value[1]) - 1;
      let selectedDay = parseInt(value[0])

      if(this.selectedMonth>11 || this.selectedMonth<0){
        this.selectedMonth = 0;
      }

      if(this.selectedYear<0){
        this.selectedYear = new Date().getFullYear();
      }
      if(selectedDay<0){
        selectedDay = 1;
      }

      this.currentDateSelected = new Date(this.selectedYear, this.selectedMonth, selectedDay);

      this.startYearInternal = this.selectedYear;
      this.buildYearsBlock();
      this.buildInputValue();
      if( prevMonth!=this.selectedMonth || prevYear!=this.selectedYear ){
        this.rebuildDaysStructure();
      }
      
      this.findDaySelected();
      this.fireValueChange();

    }
  }

  goToPrevYears(){
    this.startYearInternal = this.startYearInternal - 12;
    this.buildYearsBlock();
  }

  goToNextYears(){
    this.startYearInternal = this.startYearInternal + 12;
    this.buildYearsBlock();
  }

  moveToNextYear(){
    this.selectedYear = this.selectedYear + 1;
    this.startYearInternal = this.startYearInternal + 1;

    this.currentDateSelected.setFullYear(this.selectedYear);
    this.buildYearsBlock();
    this.buildInputValue();
    this.fireValueChange();
  }

  moveToPreviousYear(){
    if(this.selectedYear>0){
      this.selectedYear = this.selectedYear - 1;
      this.startYearInternal = this.startYearInternal + -1;

      this.currentDateSelected.setFullYear(this.selectedYear);
      this.buildYearsBlock();
      this.buildInputValue();
      this.fireValueChange();
    }    
  }

  moveToNextMonth(){
    this.selectedMonth = this.currentDateSelected.getMonth() + 1;
    this.currentDateSelected.setMonth(this.selectedMonth);
    this.selectedYear = this.currentDateSelected.getFullYear();
    this.selectedMonth = this.currentDateSelected.getMonth();
    this.rebuildDaysStructure();
    this.findDaySelected();
    this.fireValueChange()
    this.buildInputValue();
  }

  moveToPrevMonth(){
    this.selectedMonth = this.currentDateSelected.getMonth() - 1;
    this.currentDateSelected.setMonth(this.selectedMonth);
    this.selectedMonth = this.currentDateSelected.getMonth();
    this.selectedYear = this.currentDateSelected.getFullYear();
    this.rebuildDaysStructure();
    this.findDaySelected();
    this.fireValueChange();
    this.buildInputValue();
  }


  get firstYear(){
    if(this.currentYears!=null && this.currentYears.length>0){
      return this.currentYears[0];
    }
    return '';
  }

  get lastYear(){
    if(this.currentYears!=null && this.currentYears.length>0){
      return this.currentYears[this.currentYears.length-1];
    }
    return '';
  }

  selectMonth(month: number){
    this.selectedMonth = month;
    this.buildInputValue();
    
    if(this.currentDateSelected!=null){
      this.currentDateSelected.setMonth(this.selectedMonth);
    }

    if(this.isAMonthpickerInternal){
      this.hideContentList();
    }else{
      this.rebuildDaysStructure();
      this.switchToDayPicker();
      this.findDaySelected();      
    }  
    
    this.fireValueChange();  
  }

  selectYear(year){
    this.selectedYear = year;

    if(this.currentDateSelected!=null){
      this.currentDateSelected.setFullYear(year)
    }

    this.showMonth = true;
    if(this.selectedMonth>0){
      this.buildInputValue();
      this.fireValueChange();
    }
  }

  private clearInputValue(){
    this.inputValue = '';
  }

  private buildInputValue(){
    let sum = this.selectedMonth + 1;
    let val = '';
    val = sum+'';
    if(sum<10){
      val = '0'+sum;
    }
    if(!this.isAMonthpickerInternal){
      var day: any = this.currentDateSelected.getDate();
      if(day<10){
        day = '0'+day;
      }
      this.inputValue = day+this.SEPARATOR+val+this.SEPARATOR+this.selectedYear;
    }else{
      this.inputValue = val+this.SEPARATOR+this.selectedYear;
    }
    
  }

  fireValueChange(){
    let event: MonthPickEvent = new MonthPickEvent();
    event.year = this.currentDateSelected.getFullYear();
    event.month = this.currentDateSelected.getMonth();

    if(!this.isAMonthpickerInternal){
      event.day = this.currentDateSelected.getDate();
    }

    this.onSelectDate.emit(event);
  }

  get currentYearBlock(){
    return this.currentYears;
  }

  showYear(){
    this.showMonth = false;
    this.showDays = false;
  }

  showContentList(){
    if(this.showContentListB==false){
      this.showContentListB = true;
    }
  }

  hideContentList(){
    this.showContentListB = false;
  }

  
  private rebuildDaysStructure(){
    let park: Date = new Date(this.selectedYear, this.selectedMonth, 1);
    
    let daysElements: DayElement[] = [];
    let daysOfOldMonth = 0;

    //park.getDay() zero is sunday 1 is monday

    if(park.getDay()!=1){
      //if is not monday
      let daysToSubtract = park.getDay()==0? 7:park.getDay();
      park.setDate(park.getDate() - daysToSubtract + 1);
      
      while(park.getMonth()!=this.selectedMonth){
        daysElements.push({isOldMonth: true, isNewMonth: false, value: park.getDate(), date: new Date(park)});
        park.setDate(park.getDate() + 1);
        daysOfOldMonth++;
      }
    }

    //reset date
    park = new Date(this.selectedYear, this.selectedMonth, 1);
    let daysOfOldCurrentMonth = 0;

    while(park.getMonth()==this.selectedMonth){
      daysElements.push({isOldMonth: false, isNewMonth: false, value: park.getDate(), date: new Date(park)});
      park.setDate(park.getDate() + 1);
      daysOfOldCurrentMonth++;
    }

    //42 are days number in calendar
    let remainingDays = 42 -(daysOfOldMonth + daysOfOldCurrentMonth);

    while(remainingDays>0){
      daysElements.push({isOldMonth: false, isNewMonth: true, value: park.getDate(), date: new Date(park)});
      park.setDate(park.getDate() + 1);
      remainingDays--;
    }
    
    this.currentWeekDays = [];

    //reshape array to matrix 
    while(daysElements.length!=0){
      this.currentWeekDays.push(daysElements.splice(0, 7));
    } 

  }

}
