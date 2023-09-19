import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {CookieService} from 'ngx-cookie-service';
//import Ruta from '@angular/router';

export interface Component_token{
 
  /**INDICA LA DIRECCION EXACTA, UNICAMENTE SE USO PARA MOSTRAR */
  Token : string;
  /**directory es el directorio en el que se encuentra */
 
}


@Injectable({
  providedIn: 'root'
})

export class JsonwtService {

  constructor(private cookieuser : CookieService) { }
  
  private TokenObservablePrivate : BehaviorSubject<Component_token> = 
  new BehaviorSubject <Component_token>({ Token : ''});
   
    get clean(){
      console.log(document.location.hostname+'/dishes');
    this.cookieuser.delete('userkey','/dishes',document.location.hostname+'/dishes');      
    return this.cookieuser.delete('userkey','/',document.location.hostname+'/');   
     
    }

     
    get TokenObservable(){            
      
      /*this.TokenObservableData =  {Token : this.cookieuser.get('userkey')}  
      return this.TokenObservablePrivate.asObservable();*/     
         
       return {Token : this.cookieuser.get('userkey')}
    }

    set TokenObservableData(data: Component_token){
     
       
       this.cookieuser.set('userkey',data.Token,2,'/dishes'  );
       this.cookieuser.set('userkey',data.Token,2,'/'  );        
        //this.TokenObservablePrivate.next(data);
    }
    get TokenObservablecheck(){

     return this.cookieuser.check('userkey');     
     
    }
    
}
