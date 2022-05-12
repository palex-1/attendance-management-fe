import { Component, OnInit } from '@angular/core';
import { DettagliIncaricoService } from 'src/app/model/services/incarico/dettagli-incarico.service';
import { WorkTaskExpensesService } from 'src/app/model/services/incarico/work-task-expenses.service';

@Component({
  selector: 'app-info-commessa',
  templateUrl: './info-commessa.component.html',
  styleUrls: ['./info-commessa.component.scss']
})
export class InfoCommessaComponent implements OnInit {

  tabSelected = 1;

  constructor(private dettagliCommessaService: DettagliIncaricoService, 
              private workTaskExpensesService: WorkTaskExpensesService) { }

  ngOnInit() {
  }

  canSeeTeamArea(){
    if(this.dettagliCommessaService.currentGrantedPermissionOnIncarico!=null && 
      this.dettagliCommessaService.currentGrantedPermissionOnIncarico.readPermission){
      
        //check if the task is enabled for all the user
        //because if it so, is not useful to manage team member, so that area will be hidden
        if(this.dettagliCommessaService.currentIncaricoLoaded!=null && this.dettagliCommessaService.currentIncaricoLoaded.task!=null){
          let isEnabledForAllUser = this.dettagliCommessaService.currentIncaricoLoaded.task.isEnabledForAllUsers;

          if(isEnabledForAllUser==true){
            return false; //team area must not visible
          }

        }
      return true;
    }
    return false;
  }

  canSeeExpensesArea(){
    if(this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses!=null && 
      this.workTaskExpensesService.currentGrantedPermissionOnIncaricoExpenses.readPermission){
      
        //check if task is and absence task
        if(this.dettagliCommessaService.currentIncaricoLoaded!=null && 
              this.dettagliCommessaService.currentIncaricoLoaded.task!=null){
          let isAnAbsenceTask = this.dettagliCommessaService.currentIncaricoLoaded.task.isAbsenceTask;

          if(isAnAbsenceTask==true){
            return false; //expenses area must not visible if the task is absence
          }

        }
      return true;
    }
    return false;
  }

  canSeeBudgetSummaryArea(){
    if(this.dettagliCommessaService.currentGrantedPermissionOnBudgetSummary!=null && 
      this.dettagliCommessaService.currentGrantedPermissionOnBudgetSummary.creationPermission){
      
        //check if the task is enabled for all the user
        //because if it so, is not useful to manage team member, so that area will be hidden
        if(this.dettagliCommessaService.currentIncaricoLoaded!=null && this.dettagliCommessaService.currentIncaricoLoaded.task!=null){
          let isEnabledForAllUser = this.dettagliCommessaService.currentIncaricoLoaded.task.isEnabledForAllUsers;

          if(isEnabledForAllUser==true){
            return false; //team area must not visible
          }

        }
      return true;
    }
    return false;
  }

  selectTab(num){
    this.tabSelected = num;
  }

  get codiceCommessa(): string{
    if(this.dettagliCommessaService.currentIncaricoLoaded!=null && this.dettagliCommessaService.currentIncaricoLoaded.task!=null){
      return this.dettagliCommessaService.currentIncaricoLoaded.task.taskCode;
    }
    return '';
  }

}
