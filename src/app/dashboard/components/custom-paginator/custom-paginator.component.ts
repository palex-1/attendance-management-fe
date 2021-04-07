import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { mapTo, delay } from 'rxjs/operators';

export interface PaginationEvent {
  selectedPage: number;
  pageSize: number;
}

const DEFAULT_LINK_SIZE: number = 5;

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent implements OnInit, AfterViewInit, OnChanges {

  @Input()
  initialRowsToShow: number;

  @Input()
  totalRecords: number;

  @Input()
  linkSize: number;

  @Input()
  initialSelectedPage: number;

  @Input()
  rowsPerPageOptions: number[];

  @Output()
  onPageChange: EventEmitter<PaginationEvent> = new EventEmitter<PaginationEvent>();

  currentSelectedPage: number = 0;
  currentPageSize: number = 0;

  currentPagesToShowInternal: number[] = [];
  rowsPerPageOptionsInternal: number[] = [10, 20, 30];
  totalRecordsInternal: number = 0;
  initialSelectedPageInternal: number = 0;
  linkSizeInternal: number = DEFAULT_LINK_SIZE;
  initialRowsToShowInternal: number = 0;

  private currentPagesNumber: number[] = [];

  private initializingComponent: boolean = true;

  private defaultValuesUsed: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initializeInputParameters();

    if(this.initialRowsToShowInternal!=null && this.initialRowsToShowInternal!=undefined){
      this.currentPageSize = this.initialRowsToShowInternal;
    }
    if(this.currentSelectedPage!=null){
      this.currentSelectedPage = this.initialSelectedPageInternal;
    }

    this.refreshParametersValues();

    this.initializingComponent = false;
  }

  ngAfterViewInit(){
    if(this.defaultValuesUsed){
      this.firePaginationEvent();
    }
  }

  private initializeInputParameters(): void{
    if(this.rowsPerPageOptions!=null && this.rowsPerPageOptions.length!=0){
      this.rowsPerPageOptionsInternal = this.rowsPerPageOptions;
    }else{ 
      this.defaultValuesUsed = true; 
    }
    if(this.linkSize!=null && this.linkSize>=3){
      this.linkSizeInternal = this.linkSize;
    }
    if(this.totalRecords!=null && this.totalRecords>=0){
      this.totalRecordsInternal = this.totalRecords;
    }else{ 
      this.defaultValuesUsed = true; 
    }
    if(this.initialSelectedPage!=null && this.initialSelectedPage>=0){
      this.initialSelectedPageInternal = this.initialSelectedPage;
    }else{ 
      this.defaultValuesUsed = true; 
    }
    if(this.initialRowsToShow!=null && this.initialRowsToShow>0){
      let found: boolean = false;
      for(let i:number=0; i<this.rowsPerPageOptions.length && !found; i++){
        if(this.initialRowsToShow==this.rowsPerPageOptionsInternal[i]){
          found = true;
        }
      }
      if(!found){
        this.initialRowsToShowInternal =  this.rowsPerPageOptionsInternal[0];
        this.defaultValuesUsed = true;
      }else{
        this.initialRowsToShowInternal = this.initialRowsToShow;
      }
    }else{
      this.initialRowsToShowInternal =  this.rowsPerPageOptionsInternal[0];
      this.defaultValuesUsed = true; 
    }
  }




  ngOnChanges(changes: SimpleChanges){
    if(this.initializingComponent){
      return;
    }
    if(changes.totalRecords!=null && changes.totalRecords!=undefined){
        if(changes.totalRecords.currentValue!=null && this.totalRecordsInternal!=changes.totalRecords.currentValue){
          this.totalRecordsInternal = changes.totalRecords.currentValue;
          this.refreshParametersValues()
        }
    }
  }

  get currentRowsPagePerOption(): number[]{
    if(this.rowsPerPageOptionsInternal==null){
      return [];
    }
    return this.rowsPerPageOptionsInternal;
  }

  pageSizeChanged(pageSize ?:any){
    this.refreshParametersValues();
    this.firePaginationEvent();
  }

  changePage(page: number){
    if(page==this.currentSelectedPage){
      return;
    }

    let pageNumbers: number[] = this.currentPagesNumber;
    this.currentSelectedPage = page;
    this.reevaluateCurrentSelectedPage(pageNumbers);
    this.refreshParametersValues();
    if(this.currentSelectedPage==page){
      this.firePaginationEvent();
    }//else the pagination event is already fired by the other component
    
  }

  private calculateCurrentPagesToShow(): number[] {
    const currentPagesNumbers: number[] = this.currentPagesNumber;
    //centering current selected page
    return this.calculatePageLinks(currentPagesNumbers.length);
  }

  private calculatePageLinks(numberOfPages: number): number[]{
      let pageLinks = [];
      let boundaries = this.calculatePageLinkBoundaries(numberOfPages),
      start = boundaries[0],
      end = boundaries[1];
      for(let i = start; i <= end; i++) {
          pageLinks.push(i + 1);
      }

      return pageLinks;
  }

  private calculatePageLinkBoundaries(numberOfPages: number) {
      let visiblePages = Math.min(this.linkSizeInternal, numberOfPages);

      //calculate range, keep current in middle if necessary
      let start = Math.max(0, Math.ceil((this.currentSelectedPage) - ((visiblePages) / 2))),
      end = Math.min(numberOfPages - 1, start + visiblePages - 1);

      //check when approaching to last page
      var delta = this.linkSizeInternal - (end - start + 1);
      start = Math.max(0, start - delta);

      return [start, end];
  }
  
  goToLastButtonActivated(): boolean {
    if(this.totalRecordsInternal==null || this.totalRecordsInternal==undefined || this.currentPageSize==null || this.currentPageSize==undefined){
      return false;
    }
    let number = Math.ceil(this.totalRecordsInternal/this.currentPageSize);
    if(number<=0){
      return false;
    }
    if(this.currentSelectedPage == number - 1){
      return false;
    }
    return true;
  }

  goToFirstButtonActivated(): boolean {
    if(this.totalRecordsInternal==null || this.totalRecordsInternal==undefined || this.currentPageSize==null || this.currentPageSize==undefined){
      return false;
    }
    let number = Math.ceil(this.totalRecordsInternal/this.currentPageSize);
    if(number<=0){
      return false;
    }
    return this.currentSelectedPage != 0;
  }

  refreshParametersValues(){
    let park = this.evaluateCurrentPageNumber();
    this.currentPagesNumber = park;
    this.currentPagesToShowInternal = this.calculateCurrentPagesToShow();
    this.reevaluateCurrentSelectedPage(park);
  }

  private evaluateCurrentPageNumber(): number[]{
    if(this.totalRecordsInternal==null || this.totalRecordsInternal==undefined || this.currentPageSize==null || this.currentPageSize==undefined){
      return [];
    }
    let number = Math.ceil(this.totalRecordsInternal/this.currentPageSize);

    if(number<0){
      return [];
    }
    let park: number [] = [];

    for(let i=1; i<=number;i++){
      park.push(i);
    }

    this.reevaluateCurrentSelectedPage(park);

    return park;
  }

  reevaluateCurrentSelectedPage(currentPagesNumber: number[]){
    if(currentPagesNumber.length==0){
      if(this.currentSelectedPage!=0){
        this.currentSelectedPage = 0;
        this.firePaginationEvent();
      }
      return;
    }
    if(this.currentSelectedPage>=currentPagesNumber.length){
      this.currentSelectedPage = currentPagesNumber.length - 1;
      this.firePaginationEvent();
      return;
    }
    if(this.currentSelectedPage<0){
      this.currentSelectedPage = 0;
      this.firePaginationEvent();
      return;
    }
  }

  goToFirstPage(){
    if(this.totalRecordsInternal==null || this.totalRecordsInternal==undefined || this.currentPageSize==null || this.currentPageSize==undefined){
      return; //no pages to make pagination
    }
    let number = Math.ceil(this.totalRecordsInternal/this.currentPageSize);
    if(number<=0){
      return; //no pages to make pagination
    }
    if( this.currentSelectedPage == 0){
      return; //first page already selected
    }

    let pageNumbers: number[] = this.currentPagesNumber;
    if(pageNumbers!=null && pageNumbers.length>0){
      this.currentSelectedPage = 0;
    }else{
      this.currentSelectedPage = 0;
    }
    this.refreshParametersValues();
    this.firePaginationEvent();
  }

  goToPreviousPage(){
    if(this.totalRecordsInternal==null || this.totalRecordsInternal==undefined || this.currentPageSize==null || this.currentPageSize==undefined){
      return; //no pages to make pagination
    }
    let number = Math.ceil(this.totalRecordsInternal/this.currentPageSize);
    if(number<=0){
      return; //no pages to make pagination
    }
    if( this.currentSelectedPage == 0){
      return; //first page selected cannot do to othwr page
    }

    this.changePage(this.currentSelectedPage - 1);
  }

  goToLastPage(){
    if(this.totalRecordsInternal==null || this.totalRecordsInternal==undefined || this.currentPageSize==null || this.currentPageSize==undefined){
      return; //no pages to make pagination
    }
    let number = Math.ceil(this.totalRecordsInternal/this.currentPageSize);
    if(number<=0){
      return; //no pages to make pagination
    }
    if(this.currentSelectedPage == number - 1){
      return; //last already selected
    }
    let pageNumbers: number[] = this.currentPagesNumber;
    if(pageNumbers!=null){
      this.currentSelectedPage = pageNumbers.length - 1;
    }else{
      this.currentSelectedPage = 0;
    }
    this.refreshParametersValues();
    this.firePaginationEvent();
  }

  goToNextPage(){
    if(this.totalRecordsInternal==null || this.totalRecordsInternal==undefined || this.currentPageSize==null || this.currentPageSize==undefined){
      return; //no pages to make pagination
    }
    let number = Math.ceil(this.totalRecordsInternal/this.currentPageSize);
    if(number<=0){
      return; //no pages to make pagination
    }
    if(this.currentSelectedPage == number - 1){
      return; //last page selected cannot go to next
    }

    this.changePage(this.currentSelectedPage + 1);
  }

  firePaginationEvent(){
    setTimeout(
      ()=>{
        this.onPageChange.emit(
          {
              selectedPage: this.currentSelectedPage,
              pageSize: this.currentPageSize
          }
        );
      }, 50
    );
  }

}
