import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const SUPPORT_GUIDE_FOR_ADMIN = './assets/docs/admin_guide.pdf';
const SUPPORT_GUIDE_FOR_USER = './assets/docs/user_guide.pdf';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  openSupportForUser(){
    this.openFile(SUPPORT_GUIDE_FOR_USER);
  }

  openSupportForAdmin(){
    this.openFile(SUPPORT_GUIDE_FOR_ADMIN);
  }

  private openFile(myPdfUrl) {
    const y = ( window.innerHeight / 2) - 300;
    const x = ( window.innerWidth / 2) - 400;
    //console.log()
    window.open(myPdfUrl, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=800' + ', height=600' + ', top=' + y + ', left=' + x);
  }


}
