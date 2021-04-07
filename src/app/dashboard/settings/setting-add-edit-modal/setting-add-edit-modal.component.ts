import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { StringUtils } from 'src/app/util/string/string-utils';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { GlobalConfigurationDetailsService } from 'src/app/model/services/settings/global-configurations-details.service';
import { GlobalConfigurationAreaService } from 'src/app/model/services/settings/global-configuration-area.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare const $: any;

@Component({
  selector: 'app-setting-add-edit-modal',
  templateUrl: './setting-add-edit-modal.component.html',
  styleUrls: ['./setting-add-edit-modal.component.scss']
})
export class SettingAddEditModalComponent implements OnInit {

  @ViewChild("addSettingModal", { static: true })
  addSettingModal: ElementRef;

  @Output()
  onAddUpdateComplete: EventEmitter<any> = new EventEmitter();

  disabledAreaEdit: boolean = false;
  disabledKeyEdit: boolean = false;
  addOrUpdateOperationInProgress: boolean = false;

  createMode: boolean = false;
  editMode: boolean = false;
  
  area: string = '';
  key: string = '';
  value: string = '';

  constructor(private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler,
                private globalConfigurationDetailsService: GlobalConfigurationDetailsService,
                  private globalConfigurationAreaService: GlobalConfigurationAreaService) { 

  }

  ngOnInit(): void {
  }

  resetAllFields(){
    this.area = '';
    this.key = '';
    this.value = '';
    this.createMode = false;
    this.editMode = false;
  }

  closeDialog(){
    $(this.addSettingModal.nativeElement).modal('hide');
  }

  openCreateDialog(){
    this.resetAllFields();
    this.disabledAreaEdit = false;
    this.disabledKeyEdit = false;
    this.createMode = true;
    this.editMode = false;
    $(this.addSettingModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  openCreateDialogWithArea(area: string){
    this.resetAllFields();
    this.area = area;
    this.disabledAreaEdit = true;
    this.disabledKeyEdit = false;
    this.createMode = true;
    this.editMode = false;
    $(this.addSettingModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  openEditDialogWithAreaAndKeyLocked(area: string, key: string, value: string){
    this.resetAllFields();
    this.area = area;
    this.key = key;
    this.value = value;
    this.disabledAreaEdit = true;
    this.disabledKeyEdit = true;
    this.createMode = false;
    this.editMode = true;
    $(this.addSettingModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }


  get showLoader(){
    if(this.addOrUpdateOperationInProgress){
      return true;
    }
    return false;
  }

  addSetting(){
    if(this.addOrUpdateOperationInProgress){
      return;
    }
    if(StringUtils.nullOrEmpty(this.key) || StringUtils.nullOrEmpty(this.area) || StringUtils.nullOrEmpty(this.value)){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data");
      return;
    }

    this.addOrUpdateOperationInProgress = true;

    this.globalConfigurationAreaService.createSetting(this.area, this.key, this.value).subscribe(
      succ=>{
        this.addOrUpdateOperationInProgress = false;
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.succesffully-added-config");
        this.onAddUpdateComplete.emit();
        this.closeDialog();
      },
      err=>{
        this.addOrUpdateOperationInProgress = false;
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );
  }

  updateSetting(){
    if(this.addOrUpdateOperationInProgress){
      return;
    }
    
    if(StringUtils.nullOrEmpty(this.key) || StringUtils.nullOrEmpty(this.area) || StringUtils.nullOrEmpty(this.value)){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data");
      return;
    }
    this.addOrUpdateOperationInProgress = true;
    
    this.globalConfigurationDetailsService.editSetting(this.area, this.key, this.value).subscribe(
      succ=>{
        this.addOrUpdateOperationInProgress = false;
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated-config");
        this.onAddUpdateComplete.emit();
        this.closeDialog();
      },
      err=>{
        this.addOrUpdateOperationInProgress = false;
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );

  }

}
