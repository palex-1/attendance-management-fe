import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomConfirmationService } from '../../dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from '../../dialogs/loading/loading.service';
import { HomeService } from 'src/app/model/services/home/home.service';
import { PieChartComponent, PieChartData } from '../components/charts/pie-chart/pie-chart.component';
import { IsMobileService } from 'src/app/util/sizing/is-mobile-service.service';


const ALL_COLORS: string[] = ['#ffcd56','#ff6384', '#36a2eb', '#4bc0c0', '#c9cbcf', '#c45850', '#e8c3b9', '#8e5ea2', '#1f4954'];

const LEGEND_POSITION_ON_SM = 'bottom';
const LEGEND_POSITION_OVER_SM = 'right';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  

  @ViewChild("pieChartRef", { static: true })
  pieChartRef: PieChartComponent;

  private chartData: PieChartData;

  legendPosition: string = 'right';

  constructor(private translate: TranslateService, private confirm: CustomConfirmationService,
                private loader: LoadingService, private homeService: HomeService, private isMobileService: IsMobileService) { 
                
  }

  ngOnInit() {  
  }

  ngAfterViewInit(): void {
    let labels = [];
    let dataValues = [];
    let colors = [];

    let lastValue = 0;
    let moreThanMaxDifferentTaskExecuted: boolean = false;

    let MAX_DIFFERENT_TASKS = ALL_COLORS.length;

    for (let [labelKey, value] of this.homeService.mapTaskCodeAndHours.entries()) {
      if(labels.length>=MAX_DIFFERENT_TASKS){
        lastValue = lastValue + value;
        moreThanMaxDifferentTaskExecuted = true;
      }else{
        labels.push(labelKey);
        dataValues.push(value)
      }
    }

    if(moreThanMaxDifferentTaskExecuted){
      labels[MAX_DIFFERENT_TASKS-1]= this.translate.instant("label.other");
      dataValues[MAX_DIFFERENT_TASKS-1] =  dataValues[MAX_DIFFERENT_TASKS-1] + lastValue;
      colors = ALL_COLORS;
    }else{
      colors = ALL_COLORS.slice(0, labels.length);
    }


    this.chartData = {
      data: dataValues,
      backgroundColor: colors,
      backgroundColorLabels : labels
    }

    this.legendPosition = this.calculateLegendPosition();
    this.pieChartRef.showPie(this.chartData, this.legendPosition, this.translate.instant("label.summary-current-month-task"));
  }


  private calculateLegendPosition(): string{
    if(this.isMobileService.isLessThan_SM_Screen()){
      return LEGEND_POSITION_ON_SM;
    }

    return LEGEND_POSITION_OVER_SM;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //every click check if the sidebar is show in desktop version
    if (this.isMobileService.isLessThan_SM_Screen()) {//if is desktop
      if(this.legendPosition!=LEGEND_POSITION_ON_SM){
        this.legendPosition = LEGEND_POSITION_ON_SM;
        this.pieChartRef.repaintPie(this.chartData, this.legendPosition, this.translate.instant("label.summary-current-month-task"));
      }
    } else {
      if(this.legendPosition!=LEGEND_POSITION_OVER_SM){
        this.legendPosition = LEGEND_POSITION_OVER_SM;
        this.pieChartRef.repaintPie(this.chartData, this.legendPosition, this.translate.instant("label.summary-current-month-task"));
      }
    }
  }


  get lastUpdateDate(){
    if(this.homeService.home!=null){
      return this.homeService.home.lastUpdateDate;
    }
    return null;
  }

  private get userProfile(){
    if(this.homeService.home!=null){
      return this.homeService.home.userProfile;
    }
    return null;
  }

  private get contract(){
    if(this.homeService.home!=null){
      return this.homeService.home.contractInfo;
    }
    return null;
  }

  private get userLevel(){
    if(this.contract!=null){
      return this.contract.level;
    }
    return null;
  }

  get nameAndSurname(){
    if(this.userProfile==null){
      return '';
    }

    if(this.userProfile.name!=null && this.userProfile.surname!=null){
      return this.userProfile.name+' '+this.userProfile.surname;
    }

    if(this.userProfile.name!=null){
      return this.userProfile.name;
    }

    if(this.userProfile.surname!=null){
      return this.userProfile.surname;
    }

    return '';
  }


  get vacationDays(){
    if(this.contract==null){
      return '-';
    }
    return this.roundNumber(this.contract.vacationDays);
  }

	get leaveHours(){
    if(this.contract==null){
      return '-';
    }
    return this.roundNumber(this.contract.leaveHours);
  }


  private roundNumber(num: number){
    return Math.round(num * 100) / 100
  }

  get userLevelStr(){
    if(this.userLevel!=null){
      return this.userLevel.level;
    }
    return '-';
  }

}
