import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FileInputUploadComponent, FileUploadEvent } from '../../components/file-input-upload/file-input-upload.component';
import { OrderEvent } from 'src/app/util/order-event.model';
import { TicketDownloadService } from 'src/app/model/services/system/ticket-download.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { MyPersonalDocumentService } from 'src/app/model/services/impiegato/my-personal-document.service';
import { HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { PersonalDocumentDTO } from 'src/app/model/dtos/impiegato/personal-document-dto.model';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { TicketDownloadDTO } from 'src/app/model/dtos/ticket-download.dto';
import { PersonalDocumentTypeDTO } from 'src/app/model/dtos/impiegato/personal-document-type-dto.model';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { forkJoin } from 'rxjs';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';

declare const $: any;

@Component({
  selector: 'app-my-personal-documents',
  templateUrl: './my-personal-documents.component.html',
  styleUrls: ['./my-personal-documents.component.scss']
})
export class MyPersonalDocumentsComponent implements OnInit {

  @ViewChild('personalDocumentFileModal', { static: true }) 
  personalDocumentFileModal: ElementRef;

  @ViewChild('personalDocumentFileInput', { static: true }) 
  personalDocumentFileInput: FileInputUploadComponent;
  
  public sortBy = new OrderEvent();

  private personalDocumentModalFile: File = null;
  selectedDocumentTypeId: number = null;
  fileProgress: number = 0;
  uploadPersonalDocumentInProgress: boolean = false;
  
  constructor(private myPersonalDocumentService: MyPersonalDocumentService, private loader: LoadingService, 
                public authoritiesService: AuthoritiesService, private confirmer: CustomConfirmationService,
                  private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler,
                    private ticketDownloadService: TicketDownloadService) { }

  ngOnInit(): void {
  }

  private clearModalForm(){
    this.fileProgress = 0;
    this.selectedDocumentTypeId = null;
    this.personalDocumentModalFile = null;
    this.personalDocumentFileInput.resetForm();
  }

  getCurrentDocumentTypeAcceptedExtensions(){
    if(this.notSelectedAnyDocumentType() || this.remainingDocumentType.length==0){
      return '*';
    }
    for(let i=0; i<this.remainingDocumentType.length; i++){
      if(this.remainingDocumentType[i].id==this.selectedDocumentTypeId){
        if(this.remainingDocumentType[i].supportedExtensions!=null){
          return this.remainingDocumentType[i].supportedExtensions;
        }else{
          return '*';
        }
      }
    }
  }

  notSelectedAnyDocumentType(): boolean{
    if(this.selectedDocumentTypeId==null || this.selectedDocumentTypeId+''==''){
      return true;
    }
    return false;
  }

  openUploadDialog(){
    this.clearModalForm();

    $(this.personalDocumentFileModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    if(this.uploadPersonalDocumentInProgress){
      return;
    }
    $(this.personalDocumentFileModal.nativeElement).modal('hide');
  }

  fileChoosedOnModal(choosedFile: FileUploadEvent){
    if(choosedFile.files.length>0){
      this.personalDocumentModalFile = choosedFile.files[0];
    }else{
      this.personalDocumentModalFile = null;
    }
  }
  
  uploadPersonalDocument(){
    if(this.uploadPersonalDocumentInProgress){
      return;
    }
    if(this.personalDocumentModalFile==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.select-an-upload-a-file');
      return;
    }

    if(this.selectedDocumentTypeId==null || this.selectedDocumentTypeId+''=='' || this.selectedDocumentTypeId+''==''){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.select-a-document-type');
      return;
    }

    this.uploadPersonalDocumentInProgress = true;

    this.myPersonalDocumentService.uploadNewPersonalDocument(this.personalDocumentModalFile, this.selectedDocumentTypeId)
        .subscribe(
          (event)=>{
            if (event.type === HttpEventType.UploadProgress) {
              // This is an upload progress event. Compute and show the % done:
              let percentDone = Math.round(100 * event.loaded / event.total);

              if(percentDone > 1){
                percentDone = percentDone - 1;
              }
              this.fileProgress = percentDone;

            } else if (event instanceof HttpResponse) {
              this.fileProgress = 100;
              this.uploadPersonalDocumentInProgress = false;
              this.notifier.notifySuccessWithI18nAndStandardTitle("message.upload-completed");
              this.closeDialog();
              this.reloadDocumentNotUploadedOfUser();
            } 
          },
          (error: HttpErrorResponse) => {
            this.uploadPersonalDocumentInProgress = false;
            this.manageErrorOnUploadPersonalDocument(error);
            this.fileProgress = 0;
          }
        );
  }

  reloadDocumentNotUploadedOfUser(){
    this.loader.startLoading();

    this.myPersonalDocumentService.loadMyNotUploadedDocumentType().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }

  manageErrorOnUploadPersonalDocument(error: HttpErrorResponse) {
    let subcode: number = error.error.subcode;
    if(error.status==ChainExceptionHandler.CONFLICT_ERROR){
      if(subcode==StandardErrorCode.ALREADY_EXIST_THIS_PERSONAL_DOCUMENT_FOR_USER){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.this-document-type-was-already-uploaded");
        return;
      }
    }  
    if(error.status==ChainExceptionHandler.BAD_DATA){
      if(subcode==StandardErrorCode.UNSUPPORTED_FILE_EXTENSIONS){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.unsupported-file-extension");
        return;
      }
    }
    this.exceptionHandler.manageErrorWithLongChain(error.status);
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.myPersonalDocumentService.currentSortBy = event;
    this.refreshUserPersonalDocument();
  }

  filtersChanged(){
    this.refreshUserPersonalDocument();
  }
  
  getCurrentPageIndex(): number{
    return this.myPersonalDocumentService.pageIndex;
  }

  getTotalRecords(): number{
    return this.myPersonalDocumentService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.myPersonalDocumentService.currentPageSize;
  }

  refreshUserPersonalDocument(){
    this.loader.startLoading();

    this.myPersonalDocumentService.realodPersonalDocument().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
      }
    );
  }

  resetFilters(){
    this.myPersonalDocumentService.resetFilters();
    this.refreshUserPersonalDocument();
  }

  changePage(event: PaginationEvent) {
    this.myPersonalDocumentService.pageIndex = event.selectedPage;
    this.myPersonalDocumentService.currentPageSize = event.pageSize;
    this.refreshUserPersonalDocument();
  }

  get documentTypeFilter(): string{
    return this.myPersonalDocumentService.documentTypeFilter;
  }

  set documentTypeFilter(value: string){
    this.myPersonalDocumentService.documentTypeFilter = value;
  }
  
  get personalDocuments(){
    return this.myPersonalDocumentService.currentLoadedData;
  }

  get remainingDocumentType(): PersonalDocumentTypeDTO[]{
    if(this.myPersonalDocumentService.currentNotUploadedTypeOfDocument==null){
      return [];
    }
    return this.myPersonalDocumentService.currentNotUploadedTypeOfDocument
  }

  get allDocumentTypes(): PersonalDocumentTypeDTO[] {
    return this.myPersonalDocumentService.currentAllDocumentType;
  }

  deletePersonalDocument(document: PersonalDocumentDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-the-document",
      ()=>{ that.executeDeletePersonalDocument(document); }
    )
  }

  executeDeletePersonalDocument(document: PersonalDocumentDTO){
    this.loader.startLoading();

    this.myPersonalDocumentService.deletePersonalDocument(document).subscribe(
      succ=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-deleted")
        this.loader.endLoading();
        this.reloadDocumentAndDocumentType();
      },
      err=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    )
    
  }

  private reloadDocumentAndDocumentType(){
    this.loader.startLoading();

    forkJoin(
      this.myPersonalDocumentService.realodPersonalDocument(),
      this.myPersonalDocumentService.loadMyNotUploadedDocumentType()
    ).subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }

  downloadPersonalDocument(document: PersonalDocumentDTO){
    this.loader.startLoading();

    this.myPersonalDocumentService.downloadPersonalDocument(document).subscribe(
      (succ: GenericResponse<TicketDownloadDTO>) => {
        this.loader.endLoading();
        this.ticketDownloadService.executeFileDownloadWithBrowser(succ.data);
      },
      (err:HttpErrorResponse)=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }



}
