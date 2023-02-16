import { Component, OnInit } from '@angular/core';

import { Category } from 'src/app/models/Category';
import { Category_ins } from 'src/app/models/Category_ins';
import { Ruta } from 'src/app/models/Ruta';
import { Paging } from 'src/app/models/Paging';


import {DishService} from '../../services/dish.service';
import {WebSocketService} from '../../services/web-socket.service';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';


import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Gallery_element } from 'src/app/models/Gallery_element';
import {environment} from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';
import { Dish_ins } from 'src/app/models/Dish_ins';

import { Dish_edit_register } from 'src/app/models/Dish_edit_register';
import { Dish_edit } from 'src/app/models/Dish_edit';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})




export class OrdersListComponent implements OnInit {

 /**Para cambiar la forma del cursor mientras se carga algo*/
 public loading_gif : any|boolean;


 
  order_info: any =[];
 


 public archivos : any= [];
 selectedOptions =[];


  constructor(private dishService: DishService,private router: Router,private activedRoute: ActivatedRoute, private http: HttpClient,private websocketservice : WebSocketService) { 
    
    this.Socket_config();

  }


  ngOnInit(): void {
    
    this.getOrders_count(0);  
    
  }


  /*ESTRUCTURA PARA REALIZAR TAREAS TEMPORALES QUE REQUIEREN ALGUNOS CAMBIOS SOBRE LA ESTRUCTURA DE categori_ins*/ 
  category_temporal: Category =
  {
    id_category:0,
    name:'',
    description:'',
    image:'',
    has_image:0
  };

  
  /**ESTRUCTURA OBTENER Y MOSTRAR LOS ELEMENTOS DE LA GALERÍA */
   gallery_element: Gallery_element=
  {
    id_gallery:0,
    src_image: ''
  }

  gallery: any =[];

   constante=0;
   LIST_DIREC: string ="";

    

 
  conectarsocket(){
    this.websocketservice.emitEvent("delivery");
   
   }

   conectarsocketintern(){
    this.websocketservice.emitEvent("intern");
    //this.order_alert();
   }

   no_results : boolean = false;
  getOrders_count(index_begining: number)
  {
    /**PONER EL CURSOR EN MODO ESPERA */
    document.body.style.cursor = 'wait';
    this.loading_gif=true;
    this.global_index_page=index_begining;
    this.no_results = false;
    //cantidad = this.global_category_count[0].count;
    //cantidad = this.global_category_count[0].count;*/
    //console.log("dato "+this.cantidad);
    this.dishService.getOrders_count(''+index_begining).subscribe(
    
      res=> {

       // console.log(res);
        this.order_info=res;     
        this.loading_gif=false;  
        document.body.style.cursor = 'default';      
      },
      err=> {
        
        this.no_results=true,
        this.loading_gif=false,
        document.body.style.cursor = 'default'
        } 
    );
  }

  global_index_page=0;
  global_quantity=0;
  global_sumatory=0;
  paging_array: any =[];
  array_product_count: any =[];
  initial_index=0;
  final_index=0;

  products_quantity_initial(){

      /**PAGINACION QUE SE LLEVA A CABO CUANDO SE ARRANCA EL PROGRAMA POR ESO TIENE QUE REALIZAR UNA CONSULTA 
       * PARA VER CUANTAS CAGEGORÍAS EXISTEN
      */

     /**LA PAGINACION LLEVO MUCHO TIEMPO DE PENSAR POR FAVOR NO CAMBIAR EL ALGORITMO JAJAJA */
        
    this.dishService.getproductsquantity().subscribe(
      res=> {

        this.array_product_count=res;     
      

      
        let suma_constante=0;
        let residuo=this.array_product_count[0].count; 
        /**LA VARIABLE global_quantity ES PARA RECORDAR EL CONTEO INICIAL QUE SE HIZO AL INICIO EN EL CONSTRUCTOR 
         * YA QUE DESPUES SIRVE EN OTRAS FUNCIONES
        */
        this.global_quantity=this.array_product_count[0].count;
    
        
        /** SUMA CONSTANTE TENDRA EL VALOR DE 0*/
        this.paging_array.push({"init" : suma_constante} );

        while(residuo > 0)
        {
            /** RESIDUO INICIALMENTE TIENE LA MISMA MAGNITUD QUE LA CANTIDAD DE CATEGORÍAS, LUEGO SE VA RESTANDO POCO A POCO
             * HASTA LLEGAR A 0, ESO CON EL FIN DE DETERMINAR EL NUMERO DE PAGINAS (programacion recursiva)*/   
            if(residuo-10 > 10 )
            {
           
              /**SI residuo -10 es mayor que 10 quiere decir que hay mas de 10 y por lo tanto se va llenando un array con la
               * variable "suma_constante" que va aumentando de 10 en 10, la primera vez que lo hace tiene un valor de 10, luego,
               * si residuo sigue siendo mayor que 10 "suma_constante" vale 20, a la siguiente 30 y así sucesivamente.
              */
               suma_constante=suma_constante+10;
               this.global_sumatory=suma_constante;
             
               this.paging_array.push({"init" : suma_constante} );
               residuo=residuo-10;              
            }

            else if( residuo-10 < 10 && residuo-10 > 0 )
            {
            
             
              /**si residuo-10 es menor que 10 significa que todavía quedan de 1 a 9 y por lo tanto hay que agregar otra paginacion,
               * por lo tanto se agrega un valor mas de "suma_constante" al array, otro valor multiplo de 10 que es la suma que se
               * viene ejecutando */               
              suma_constante=suma_constante+10;
              this.global_sumatory=suma_constante;
              this.paging_array.push({"init" : suma_constante} );
              
               residuo= residuo-residuo;             
            }
            
             else if(residuo-10 == 10 )
            {
      
              /**SI EL RESIDUO MENOS 10 ES IGUAL A 10 YA NO ES NECESARIO AGREGAR UNA NUEVA PAGINA, PUES CON LAS COMPARACIONES
            ANTERIORES SE DEJA PREPARADA LA PAGINACION , UNICAMENTE ES NECESARIO RESTARLE LOS 10 PARA QUE PASE A CERO Y SE DETENGA
            EL CICLO  */
              residuo=residuo-10;             
            }
           
            else if(residuo-10 == 0 )
            {
              
              /**SI EL RESIDUO MENOS 10 ES IGUAL A 10 YA NO ES NECESARIO AGREGAR UNA NUEVA PAGINA, PUES CON LAS COMPARACIONES
            ANTERIORES SE DEJA PREPARADA LA PAGINACION , UNICAMENTE ES NECESARIO RESTARLE LOS 10 PARA QUE PASE A CERO Y SE DETENGA
            EL CICLO  */
              residuo=residuo-10;             
            }
            
        }

          

        
      },
      err=> console.error(err)
    );

  }


  value_toggle : boolean  = true;
  value_toggle2 = false;
  opcion1= true;
  
   
  
  getproducts_quantity(){

    /**PAGINACION QUE SE LLEVA A CABO CUANDO YA SE TIENE EL CONTEO INICIAL Y SE TIENE UN NUEVO ELEMENTO
     * ES POR ESO QUE SE LLAMA UNICAMENTE CUANDO SE AGREGA UNA NUEVA CATEGORÍA
    */
       

      let residuo=0; 
      let nueva_suma;
    
      /**global_sumatory contiene la cantidad de 10 en 10 que se mantiene en la paginación y global_quantity
       * tiene la canntidad de elementos disponibles en las categorías
      */
      
      residuo=this.global_quantity-this.global_sumatory
      
 

     
          if(residuo > 10 )
          {
    
             this.global_sumatory=this.global_sumatory+10;
 
             this.paging_array.push({"init" : this.global_sumatory} );
             //residuo=residuo-10;
   
             this.getOrders_count(this.global_index_page);
            
          }

          else if(residuo < 10 )
          {
      
             this.getOrders_count(this.global_index_page);            
          }

          else if(residuo == 10 )
          {
   
             this.getOrders_count(this.global_index_page);
            
          }
          
     
}


    order_sound(){

      const music = new Audio('assets/sounds/SD_ALERT_29.mp3');
      music.play();
   
    }
    

    Socket_config(){
      
      if(environment.Socket_state == 0)
      {

        
          this.websocketservice.callback.subscribe(res =>{
    
           if(res=="delivery")
          {
           //this.delivery_order_alert(); 
           this.websocketservice.delivery_order_alert();
          }
  
          if(res=="intern")
           {
           this.websocketservice.intern_order_alert(); 
           }
           });

          
           environment.Socket_state = 1;

      }

    }


  /*extraerBase64 = async ($event : any) => new Promise((resolve, reject) =>{
       
         try {
              const unsafeImg= window.URL.createObjectURL($event); 
              const image = this.sanitizer.bypassSecurityTrustHtml(unsafeImg);
              const reader =new FileReader();
              reader.readAsDataURL($event);
              reader.onload = () => {
                     resolve({
                          base: reader.result
                     }
                     );
              };

              reader.onerror= error => {
                resolve({
                   /*blob: $event,
                   image,*/
                 /*  base: null    

                });
              };


         } catch (error) {
           return (error);
         }

   } );*/

  
}
