import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {  Observable, Subscription } from 'rxjs';
import { JsonwtService, Component_token} from './services/jsonwt.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

    logueado : number = 0;

    Token$: Observable<Component_token> | undefined;
    value: Subscription;
    tokenvalue : string | any; 
  constructor(private cookieuser : CookieService, private tokenSvc : JsonwtService) {

       //this.logueado = this.cookieuser.set('userkey',''+this.access_result.token);
       //console.log(this.cookieuser.get)
       //console.log("esta cargando");
       //this.cookieuser.set('UserAutenticado','si',0.3);
       //console.log (this.cookieSvc.get('UserAutenticado'));
       this.tokenSvc.TokenObservable
    
       //this.tokenSvc.TokenObservableData =  {Token : "/assets/img/no_image.png"}  

       this.value = this.tokenSvc.TokenObservable.subscribe(value => {
        this.tokenvalue = value.Token;
        
      });
       
     

    }




}


