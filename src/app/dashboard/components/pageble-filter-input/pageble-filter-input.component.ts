import { Component, OnInit, Input } from '@angular/core';
import { PagebleFilterInterfaceService } from './pageble-filter-interface.service';

@Component({
  selector: 'app-pageble-filter-input',
  templateUrl: './pageble-filter-input.component.html',
  styleUrls: ['./pageble-filter-input.component.scss']
})
export class PagebleFilterInputComponent implements OnInit {

  @Input()
  pagebleFilterService: PagebleFilterInterfaceService;

  labelToFilter: string[] = [];

  constructor() { }

  ngOnInit() {
  }


  filterWithLabel(label: string){
    this.labelToFilter.push(label);
    if(this.labelToFilter.length>1){
      return;
    }
    const oldSize: number = this.labelToFilter.length;

    setTimeout(
      ()=>{
        if(this.labelToFilter!=null && this.labelToFilter.length>0){
          this.executeFilter(this.labelToFilter[this.labelToFilter.length-1], oldSize)
        }
      }, 250
    )
  }

 

  executeFilter(lastLabelInserted: string, oldSize: number){

    // callBackend.subscribe(

    //   res=>{

    //     //set data to show in dropdown

    //     if(oldSize!=this.labelToFilter.length){

    //       let park: string= this.labelToFilter[this.labelToFilter.length-1];

    //       this.labelToFilter = [];

    //       this.filterWithLabel(park);

    //     }else{

    //      this.labelToFilter = [];

    //     }

    //   }

    // );

  }

}
