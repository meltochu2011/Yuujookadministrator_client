import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Component_dat{  
  /**INDICA LA DIRECCION EXACTA, UNICAMENTE SE USO PARA MOSTRAR */
  location : string;
  /**directory es el directorio en el que se encuentra */

}


@Injectable({
  providedIn: 'root'
})
export class SharingService {

  private sharingObservablePrivate : BehaviorSubject<Component_dat> = 
  new BehaviorSubject <Component_dat>({ location : 'Hola mundo '});

    get SharingObservable(){
      return this.sharingObservablePrivate.asObservable();
    }

   
    set SharingObservableData(data: Component_dat){
       
        this.sharingObservablePrivate.next(data);
    }

    SharingObservableData_empty(data: Component_dat){
     
      
     }
}
