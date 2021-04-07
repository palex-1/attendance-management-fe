import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableTdDirective } from './sortable-td.directive';
import { PaginationCounterDirective } from './pagination-counter.directive';
import { FilterChangeCollectorDirective } from './filter-change-collector.directive';
import { ClickOutsideDirective } from './click-outside.directive';
import { ChangeBackgroundDirective } from './change-background.directive';
import { HighlightDirective } from './highlight.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SortableTdDirective,
    PaginationCounterDirective,
    FilterChangeCollectorDirective,
    ClickOutsideDirective,
    ChangeBackgroundDirective,
    HighlightDirective
  ],
  exports: [
    SortableTdDirective,
    PaginationCounterDirective,
    FilterChangeCollectorDirective,
    ClickOutsideDirective,
    ChangeBackgroundDirective,
    HighlightDirective
  ]
})
export class DirectiveModule { }
