import { Component, OnInit } from '@angular/core';
import { DettagliIncaricoService } from 'src/app/model/services/incarico/dettagli-incarico.service';

@Component({
  selector: 'app-info-commessa',
  templateUrl: './info-commessa.component.html',
  styleUrls: ['./info-commessa.component.scss']
})
export class InfoCommessaComponent implements OnInit {

  tabSelected = 1;

  constructor(private dettagliCommessaService: DettagliIncaricoService) { }

  ngOnInit() {
  }

  canSeeTeamArea(){
    if(this.dettagliCommessaService.currentGrantedPermissionOnIncarico!=null && 
      this.dettagliCommessaService.currentGrantedPermissionOnIncarico.readPermission){
      
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
