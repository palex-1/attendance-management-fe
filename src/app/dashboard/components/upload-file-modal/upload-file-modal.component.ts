import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FileUploadEvent } from '../file-input-upload/file-input-upload.component';

declare const $: any;

@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss']
})
export class UploadFileModalComponent implements OnInit {

  @ViewChild("uploadFileModal", { static: true })
  uploadFileModal: ElementRef;

  @Input()
  title: string;

  @Input()
  progress: number;

  @Input()
  fileAccepted: string;

  @Input()
  multiFile: boolean;

  @Input()
  responsive: boolean;

  @Output()
  onFileUpload: EventEmitter<FileUploadEvent> = new EventEmitter<FileUploadEvent>();
  

  showLoader: boolean = false;

  constructor() { }

  ngOnInit(): void {
   
  }

  
  openDialog(){
    $(this.uploadFileModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    if(this.progress==null || this.progress==0){
      $(this.uploadFileModal.nativeElement).modal('hide');
    }
  }

  onFileUploadEvent(event){
    this.onFileUpload.emit(event)
  }

}
