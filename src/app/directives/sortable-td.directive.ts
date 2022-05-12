import { Directive, HostListener, ElementRef, Input, Renderer2, AfterViewInit, OnInit, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderEvent } from '../util/order-event.model';

@Directive({
  selector: '[sortable-td]'
})
export class SortableTdDirective implements OnInit, OnChanges{
  
  @Input("sortByValue") sortByValue: string;

  @Input("status") status: number;

  @Input("sortBy") 
  sortBy: OrderEvent;

  @Output()
  onSortChange: EventEmitter<OrderEvent> = new EventEmitter();

  icon: any;

  private orderEvent: OrderEvent = new OrderEvent();
  
  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit(){
    const i = this.renderer.createElement('i');
    this.renderer.addClass(i, "fas");
    this.renderer.addClass(i, "fa-sort");
    
    this.renderer.appendChild(this.el.nativeElement, i);
    this.renderer.addClass(this.el.nativeElement, "td-sortable");
    this.icon = i;
    this.orderEvent.setSortBy(this.sortByValue);
    //this.listenSortByEvents(this.sortByValue);    
  }


  ngOnChanges(changes: SimpleChanges){
      if(changes['sortBy']){
        if(changes['sortBy'].currentValue.getSortBy() != this.orderEvent.getSortBy()){
          //if arrive a sort event not for me i reset my status
          this.resetStatus();
        }
      }
  }

  resetSortBy(): void{
    this.onSortChange.emit(new OrderEvent('',''))
    //this.sortBy.next(new OrderEvent('',''));
  }

  setSortByMe(): void {
    if(this.sortBy==null){
      return;
    }
    this.onSortChange.emit(this.orderEvent)
    //this.sortBy.next(this.orderEvent);
  }

 
  @HostListener('click') onMouseEnter() {
    if(this.status==0){
      this.orderEvent.setDesc();
      this.status=1;
      this.renderer.removeClass(this.icon, "fa-sort");
      this.renderer.addClass(this.icon, "fa-sort-up");
      this.setSortByMe();
      return;
    }
    if(this.status>0){
      this.orderEvent.setAsc();
      this.status=-1;
      this.renderer.removeClass(this.icon, "fa-sort-up");
      this.renderer.addClass(this.icon, "fa-sort-down");
      this.setSortByMe();
      return;
    }
    if(this.status<0){
      this.orderEvent.resetSortByDir();
      this.resetSortBy();
      this.status = 0;
      this.renderer.removeClass(this.icon, "fa-sort-down");
      this.renderer.addClass(this.icon, "fa-sort");
      return;
    }
  }


  resetStatus(){
    if(this.status>0){
      this.status = 0;
      this.orderEvent.resetSortByDir();
      this.renderer.removeClass(this.icon, "fa-sort-up");
      this.renderer.addClass(this.icon, "fa-sort");
      return;
    }
    if(this.status<0){
      this.status = 0;
      this.orderEvent.resetSortByDir();
      this.renderer.removeClass(this.icon, "fa-sort-down");
      this.renderer.addClass(this.icon, "fa-sort");
      return;
    }
  }

  
}