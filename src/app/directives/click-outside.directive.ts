import { Directive, ElementRef, Output, OnInit, EventEmitter } from '@angular/core';

declare const $: any;

@Directive({
    selector: '[clickOutside]'
})
export class ClickOutsideDirective implements OnInit {

    @Output()
    public clickOutside = new EventEmitter();

    constructor(private _elementRef : ElementRef) {
    }

    ngOnInit(){
        let that = this;

        $(document).mouseup(
            function(e) 
        {
            var container = $(that._elementRef.nativeElement);
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                that.clickOutside.emit(null);
            }
        });

    }
}