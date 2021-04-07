import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class FileUtilityService {
  

  constructor() { }


  createAndDownloadBlobFile(fileContent: Blob, filename) {
    if (navigator.msSaveBlob) 
    { 
      navigator.msSaveBlob(fileContent, filename);
    } 
    else
    {
      var link = document.createElement('a');
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) 
      {
          var url = URL.createObjectURL(fileContent);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
    }
  }

  extractContentTypeOrUseDefault(data: HttpResponse<any>, defaultContentType: string) {
    let contentType: string = this.extractContentType(data);

    if(contentType==null){
      return defaultContentType;
    }

    return contentType;
  }

  public extractContentType(data: HttpResponse<any>): string{
    if(data==null || data.headers==null){
      return null;
    }
    let contentType = data.headers.get('Content-Type');
    
    return contentType;
  }

  public extractFileNameOrUseDefault(data: HttpResponse<any>, defaultName: string): string{
    let filename: string = this.extractFileNameFromContentDisposition(data);

    if(filename==null){
      return defaultName;
    }

    return filename;
  }

  public extractFileNameFromContentDisposition(data: HttpResponse<any>): string{
    if(data==null || data.headers==null){
      return null;
    }
    let contentDisposition = data.headers.get('content-disposition');
    if(contentDisposition==null){
      return null;
    }
    let park: string[] = contentDisposition.split("filename =");

    if(park!=null && park.length>1){
      return park[1];
    }

    return null;
  }


  public static openLinkInNewPage(href: string, target ?: string){
    var link=document.createElement("a");
    link.setAttribute('href', href);
    if(target!=null){
      link.setAttribute('target', target);
    }
    //Add the link somewhere, an appendChild statement will do.
    //Then run this
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
