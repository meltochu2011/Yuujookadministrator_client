import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {  Observable, Subscription } from 'rxjs';
import { Component_token, JsonwtService} from './services/jsonwt.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

    logueado : number = 0;

    //Token$: Observable<Component_token>;
    value: Subscription | undefined;
    tokenvalue : string  = "";
    
    verificar : boolean = false;
  constructor(private tokenSvc : JsonwtService) {

        this.verificar = this.tokenSvc.TokenObservablecheck;

        if (this.verificar == true )
        {
          this.tokenvalue = ""+this.tokenSvc.TokenObservable;   
                 
        }

        else if (this.verificar == false )
        {
          this.tokenvalue = ""; 
        }
       //this.tokenvalue=this.tokenSvc.TokenObservable;
        
       /**OBTENEMOS EL VALOR DEL TOKEN MEDIANTE TokenObservable Esto es a la hora de la carga inicial*/
      /* this.value = this.tokenSvc.TokenObservable.subscribe(value => {
        
        this.tokenvalue = value.Token;
        
       /* 
       
        else if(this.tokenvalue !== "" )
        {
          alert(this.tokenvalue);
          //this.tokenSvc.clean;        
        }*/
        

      //});

    }

}


