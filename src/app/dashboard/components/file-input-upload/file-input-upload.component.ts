import { Component, OnInit, OnChanges, Input, SimpleChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IsMobileService } from 'src/app/util/sizing/is-mobile-service.service';

export interface FileUploadEvent {
  files: FileList;
}

@Component({
  selector: 'app-file-input-upload',
  templateUrl: './file-input-upload.component.html',
  styleUrls: ['./file-input-upload.component.scss']
})
export class FileInputUploadComponent implements OnInit, OnChanges {

  @ViewChild('progressbar', { static: true }) 
  progressbar: ElementRef;

  @ViewChild('fileInput', { static: true })
  fileInput: ElementRef;

  @Input()
  progress: number;

  @Input()
  fileAccepted: string;

  @Input()
  disabled: boolean;

  @Input()
  multiFile: boolean;

  @Input()
  responsive: boolean;

  @Output()
  onFileUpload: EventEmitter<FileUploadEvent> = new EventEmitter<FileUploadEvent>();

  @Output()
  onFileChoose: EventEmitter<FileUploadEvent> = new EventEmitter<FileUploadEvent>();

  @Input()
  hideActionsButtons: boolean = false;

  @Input()
  showSupportedExtLabel: boolean;

  progressValue: number = 0;

  private currentFileName: string = '';
  private choosenFile: FileList = null;
  uploadInProgress: boolean = false;
  fileChoosen: boolean = false;

  constructor(private traslate: TranslateService,
                private isMobileSrv: IsMobileService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.progress!=null && changes.progress!=undefined){
        if(changes.progress.currentValue!=null){
          this.updatePercentDone(changes.progress.currentValue)
        }
    }
  }

  get showActionsButtonsInternal(): boolean {
    return !(this.hideActionsButtons+''=='true');
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    
    if(fileList.length > 0) {
        this.choosenFile = fileList;
        if(fileList.length>1){
          this.currentFileName = fileList.length+" "+this.traslate.instant("file-input-upload.num-files-selected");
        }else{//equals to 1
          this.currentFileName = fileList[0].name;
        }

        this.sendOnFileChooseEvent();
        this.fileChoosen = true;
    }
    
  }

  isMultiFile(): boolean{
    if(this.multiFile==null){
      return false;
    }
    return this.multiFile;
  }

  sendOnFileChooseEvent(): void{
    if(this.currentFileName!=null && this.currentFileName.trim()!='' && this.choosenFile!=null && !this.uploadInProgress){
      let event: FileUploadEvent = {
        files: this.choosenFile
      };
      this.onFileChoose.emit(event);
    }
  }

  sendUploadEvent(): void{
    if(this.currentFileName!=null && this.currentFileName.trim()!='' && this.choosenFile!=null && !this.uploadInProgress){
      let event: FileUploadEvent = {
        files: this.choosenFile
      };
      this.uploadInProgress = true;
      this.onFileUpload.emit(event);
    }
  }

  acceptedFileType(): string{
    if(this.fileAccepted==null){
      return '';
    }
    return this.fileAccepted;
  }

  currentSelectedFileName(): string {
    if(this.currentFileName==null || this.currentFileName.trim()==''){
      return this.traslate.instant("file-input-upload.no-file-selected")+"...";
    }
    return this.currentFileName;
  }

  cancelUpload(): void{
    this.resetForm();
  }

  resetForm(): void {
    this.choosenFile = null;
    this.uploadInProgress = false;
    this.fileChoosen = false;
    this.currentFileName = null;
    if(this.progressbar!=null && this.progressbar.nativeElement!=null){
      this.progressbar.nativeElement.value = '';
      this.progressbar.nativeElement.innerHTML = "";
      this.progressbar.nativeElement.style.width = 0 + '%';
    }
    if(this.fileInput!=null && this.fileInput.nativeElement!=null){
      this.fileInput.nativeElement.value = "";
    }
  }

  private updatePercentDone(percent: number): void{
    if(this.progressbar!=null && this.progressbar.nativeElement!=null){
      if(percent==null){
        this.resetForm();
      }else{
        if(percent>100){
          throw new Error("percent cannot be greater than 100");
        }
        this.progressbar.nativeElement.innerHTML = percent+"%";
      }
      this.progressbar.nativeElement.style.width = percent + '%';
    }
  }

  showButtonTitle(){
    if(this.responsive){
      if(this.isMobileSrv.isLessThan_XS_Screen()){
        return false;
      }
    }
    return true;
  }

}
