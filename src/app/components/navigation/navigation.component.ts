import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {JsonwtService} from 'src/app/services/jsonwt.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private jwtservice : JsonwtService) {
    
        this.too_menu();    
   }

  ngOnInit(): void {
  }



  toogle : boolean =false;

  too_menu(){
      
      this.toogle=false;
  }

  
    clean(){
      const value=this.jwtservice.Clean;
       
       if(value.value == true)
       {
        window.location.reload();
       }     
      
    }
  



}
