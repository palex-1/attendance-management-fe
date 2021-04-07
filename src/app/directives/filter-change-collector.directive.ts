import { Directive, Input, Output, EventEmitter, SimpleChanges, OnChanges } from "@angular/core";
import { AppConstans } from "../app.constants";

export interface ChangeFilterEvent {
    value;
}

@Directive({
    selector: '[filter-change-collector]'
})
export class FilterChangeCollectorDirective implements OnChanges{

    @Input("valueToFilter")
    valueToFilter: any;

    @Output("onCollectedChange")
    onCollectedChange: EventEmitter<ChangeFilterEvent> = new EventEmitter();

    filterRequestsInProgress: number = 0;
    currentValue: any= null;
    isFirstChange: boolean = true;

    constructor(){
        this.filterRequestsInProgress = 0;
        this.currentValue = this.valueToFilter;
        this.isFirstChange = true;
    }

    ngOnChanges(changes: SimpleChanges){
        if(changes.valueToFilter){
            if(this.isFirstChange){
                this.currentValue = changes.valueToFilter.currentValue;
                this.isFirstChange = false;
            }else{
                this.onFilterChange(changes.valueToFilter.currentValue);
            }
        }
    }

    onFilterChange(value: any) {
        this.currentValue = value;
        this.filterRequestsInProgress++;
        let that = this;
        setTimeout(function () {
            if (that.filterRequestsInProgress <= 1) {
                if(that.currentValue==null || that.currentValue==''){
                    that.sendFilterChangeEvent(null);
                }else{
                    that.sendFilterChangeEvent(that.currentValue);
                }
            }
            that.filterRequestsInProgress--;
        }, AppConstans.FilterChangeColletion_DIRECTIVE_TIME);
    }

    sendFilterChangeEvent(value: any){
        this.onCollectedChange.emit({
            value: value
        });
    }
}