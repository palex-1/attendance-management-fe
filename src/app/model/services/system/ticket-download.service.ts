import { Injectable } from '@angular/core';
import { BackendUrlsService } from '../../backend-urls.service';
import { TicketDownloadDTO } from '../../dtos/ticket-download.dto';

@Injectable()
export class TicketDownloadService {

  constructor(private backendUrl: BackendUrlsService) { 

  }


  public executeFileDownloadWithBrowser(ticket: TicketDownloadDTO){
    let url: string = this.backendUrl.buildDownloadDocumentPath(ticket.tokenDownload);
    
    let a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    //a.download = url.substr(url.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }




}
