import { Component , OnInit} from '@angular/core';
import { BackgroundThemingService } from '../util/theming/background-theming.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{  


  constructor(private themingSrv: BackgroundThemingService) {
  }

  ngOnInit() {
    this.themingSrv.setDashboardBackground();
  }

}
