import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {CookieService} from 'ngx-cookie-service';


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
    
      return this.cookieuser.delete('userkey');
    }
     
    get TokenObservable(){            
       
      this.TokenObservableData =  {Token : this.cookieuser.get('userkey')}  
        return this.TokenObservablePrivate.asObservable();      
    }

    set TokenObservableData(data: Component_token){
      this.cookieuser.set('userkey',''+data.Token);
        this.TokenObservablePrivate.next(data);
    }

  //constructor() { }
}
