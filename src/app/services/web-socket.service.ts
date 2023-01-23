import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends Socket{
  
  outEven : EventEmitter <any> = new EventEmitter();
  callback : EventEmitter <any> = new EventEmitter();

  constructor() {
    super({
      url:'http://localhost:4000',
      options:{
        query:{

          nameRoom: '"campo ejemplo de socket"',
        }

      }
      
    })
       this.listen();

   }


   listen =() => {
    /**ESCUCHAMOS LOS EVENTOS */
    this.ioSocket.on('event', (res: any) => this.callback.emit(res));
    
  }

  emitEvent = (payload ={}) =>{
    /**EMITIMOS UN EVENTO */
    this.ioSocket.emit('event',payload);
  }


  delivery_order_alert(){
    // assets/img/no_image.png

    Swal.fire({

      
     position: 'top-end',
   
     /**ANTES ESTABA ESTE CON BOTONES */
    
     html: " <img src='assets/statics_img/delivery.png'> <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Orden entrante &nbsp;</b> ",
     
     confirmButtonColor: "#00ff55",
     showConfirmButton: false,
     timer: 14000,
     timerProgressBar: true,
     toast: true,       
     background:"#f0f8ff",  
     showCloseButton: true,    
     //width: '60px',
     //margin: '30px',
     //height: '30px',
   })

   const music = new Audio('assets/sounds/SD_ALERT_25.mp3');
   
   setTimeout(function(){      
   music.load();
   music.play();
  
   },1000);

   setTimeout(function(){      
     music.load();
     music.play();
    
     },4000);

     setTimeout(function(){      
       music.load();
       music.play();
      
       },8000);
 
       setTimeout(function(){      
         music.load();
         music.play();
        
         },12000);
   
   }

   
   intern_order_alert(){
    // assets/img/no_image.png

    Swal.fire({

      
     position: 'top-end',
   
     html: " <img src='assets/statics_img/foodmeal.ico'> <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Orden entrante &nbsp;</b> ",
     
     //imageUrl: this.API_URI+'uploads/foodmeal.ico',

     //imageHeight:50,
     //text: "Orden detectada "+this.API_URI+'uploads/foodmeal.ico',
     //confirmButtonText: "Sí, eliminar",
     confirmButtonColor: "#00ff55",
     showConfirmButton: false,
     timer: 13000,
     timerProgressBar: true,
     toast: true,       
     background:"#f0f8ff",  
     showCloseButton: true,    
     //width: '60px',
     //margin: '30px',
     //height: '30px',
   })

   const music = new Audio('assets/sounds/SD_ALERT_29.mp3');
   
   setTimeout(function(){      
   music.load();
   music.play();
  
   },1000);

   setTimeout(function(){      
     music.load();
     music.play();
    
     },3000);

     setTimeout(function(){      
       music.load();
       music.play();
      
       },5000);
 
       setTimeout(function(){      
         music.load();
         music.play();
        
         },7000);
   
         setTimeout(function(){      
           music.load();
           music.play();
          
           },9000);
     
           setTimeout(function(){      
             music.load();
             music.play();
            
             },11000);
       
     

   }


}
