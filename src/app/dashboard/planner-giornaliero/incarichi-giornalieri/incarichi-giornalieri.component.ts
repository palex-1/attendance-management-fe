import { Component, OnInit } from '@angular/core';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-incarichi-giornalieri',
  templateUrl: './incarichi-giornalieri.component.html',
  styleUrls: ['./incarichi-giornalieri.component.scss']
})
export class IncarichiGiornalieriComponent implements OnInit {

  public sortBy = new OrderEvent();
  initialSelectedPage: number = 0;
  
  constructor() { }

  ngOnInit() {
  }

  changePage(event: PaginationEvent) {
  }

  refreshData(){

  }

  
}
