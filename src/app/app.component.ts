import { Component, OnInit } from '@angular/core';
import { SetLanguageService } from './util/language/set-language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  

  constructor(private setLanguageService: SetLanguageService){
  }

  ngOnInit(){
    this.setLanguageService.inizializeLanguage()
  }

}
