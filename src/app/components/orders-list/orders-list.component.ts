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
import {EditdishDetailComponent} from 'src/app/components/editdish-detail/editdish-detail.component';
import { OrderdetailModalComponent } from '../orderdetail-modal/orderdetail-modal.component';

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
    //this.getOrders_count(0); 

  }


  ngOnInit(): void {
    
    this.getOrders_count(0);  
    this.orders_quantity();
    
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

    

   example : any =
   {
      "customer_name": "David",
      "customer_last_name": "Web",
      "phone": "52969999",
      "address": "Zona 24",
      "has_whatsapp": true,
      "total": 75,
      "products": [
          {
              "id_product": 1,
              "amount": 4,
              "sub_total": 80,
              "add_ons": [
                  {
                      "tag": "Ensalada de lechuga",
                      "price":0.0
                  }
              ]
          },
          {
              "id_product": 1,
              "amount": 5,
              "sub_total": 50,
              "add_ons": [
        
              ]
          },
          {
              "id_product": 1,
              "amount": 5,
              "sub_total": 100,
              "add_ons": [
                  {
                      "tag": "Salsa dulce",
                      "price": 0.0
                  },
                  {
                      "tag": "Salsa picamas",
                      "price": 0.0
                  }
              ]
          }
      ]
  }
; 


 
  orderdetail_id : number = 0; 
  asign_orderid(orderdetail_id : number){    
    environment.orderdetail_id = orderdetail_id;  
    this.orderdetail_id = orderdetail_id;
    //this.orderdetailcomponent.getOrder_detail(orderdetail_id);
  }

  conectarsocket(){
    //this.websocketservice.emitEvent("delivery");
      this.websocketservice.emitDataEvent(this.example);
      
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
  array_orders_count: any =[];
  initial_index=0;
  final_index=0;

  orders_quantity(){

       /**LIMPIAMOS EL ARRAY QUE SE TIENE DESDE UN INICIO PARA PAGINACION*/
    this.paging_array=[];

    /**PAGINACION QUE SE LLEVA A CABO PARA VER CUANTOS PRODUCTOS EXISTEN,
     * COMIENZA CON UN CONTEO, LUEGO SE EJECUTA EL ALGORITMO DE PAGINACION
    */
    
    
  this.dishService.get_orders_quantity().subscribe(
    res=> {

      this.array_orders_count=res;     
    
      let suma_constante=0;
      let residuo=this.array_orders_count[0].count; 
      
      /** SUMA CONSTANTE TENDRA EL VALOR DE 0*/
      this.paging_array.push({"init" : suma_constante} );

      while(residuo > 0)
      {
          /** RESIDUO INICIALMENTE TIENE LA MISMA MAGNITUD QUE LA CANTIDAD DE PRODUCTOS, LUEGO SE VA RESTANDO POCO A POCO
           * HASTA LLEGAR A 0, ESO CON EL FIN DE DETERMINAR EL NUMERO DE PAGINAS (programacion recursiva)*/   
          if(residuo > 10 )
          {
            /**SI residuo es mayor que 10 quiere decir que hay mas de 10 y por lo tanto se va llenando un array con la
             * variable "suma_constante" que va aumentando de 10 en 10, la primera vez que lo hace tiene un valor de 10, luego,
             * si residuo sigue siendo mayor que 10 "suma_constante" vale 20, a la siguiente 30 y así sucesivamente.
            */
             suma_constante=suma_constante+10;
             this.global_sumatory=suma_constante;
           
             this.paging_array.push({"init" : suma_constante} );
             residuo=residuo-10;              
          }

          else if(residuo-10 == 0 || residuo-10 < 10 )
          {/**SI EL RESIDUO ES IGUAL A 10 O MENOR QUE 10 YA NO ES NECESARIO AGREGAR UNA NUEVA PAGINA, PUES CON 
          EL VALOR INICIAL QUE SE AGREGA AL INICIO DE LA FUNCION ES SUFICIENTE PARA CUBRIR VALORES QUE VAN DE 1 A 10,
           UNICAMENTE ES NECESARIO IGUALAR EL RESIDUO A CERO Y ASÍ SE DETENGA EL CICLO  */
            residuo=0;             
          }
          
      }

    },
    err=> console.error(err)
  );


  }


 
 

    Socket_config(){
      
      if(environment.Socket_state == 0)
      {

        
          this.websocketservice.callback.subscribe(res =>{
    
           if(res=="delivery")
          {
           //this.delivery_order_alert(); 
           this.getOrders_count(0);
           this.websocketservice.delivery_order_alert();
          
           
           
          }
  
          if(res=="intern")
           {
           this.websocketservice.intern_order_alert(); 
           }

           });

           this.websocketservice.orderresponse.subscribe(res =>{
    
           
            if(res==true)
            {
               alert("hola");
            }
 
            });          
           environment.Socket_state = 1;

      }

    }


    order_detail_info: any =[];
  /**Para cambiar la forma del cursor mientras se carga algo*/
 public loading_modaldetail_gif : any|boolean;
  getOrder_detail_modal(orderdetail_id: number)
  {
     this.order_detail_info=[];
  
    /**PONER EL CURSOR EN MODO ESPERA */
    document.body.style.cursor = 'wait';
    this.loading_modaldetail_gif=true;
    //this.global_index_page=index_begining;
    this.no_results = false;
    //cantidad = this.global_category_count[0].count;
    //cantidad = this.global_category_count[0].count;*/
    //console.log("dato "+this.cantidad);
    this.dishService.get_order_detail(orderdetail_id).subscribe(
     
      res=> { 
        this.order_detail_info=res;     
        this.loading_modaldetail_gif=false;  
        document.body.style.cursor = 'default';      
      },
      err=> {
        
        this.no_results=true,
        this.loading_modaldetail_gif=false,
        document.body.style.cursor = 'default'
        } 
    );

    this.getOrder_detail(orderdetail_id);
    this.get_orderitems_detail(orderdetail_id);
  }


  order_detail: any =[];
  //public loading_modaldetail_gif : any|boolean;
  getOrder_detail(orderdetail_id: number)
  {
     
    this.order_detail=[];
    /**PONER EL CURSOR EN MODO ESPERA */
    document.body.style.cursor = 'wait';
    this.loading_modaldetail_gif=true;
    //this.global_index_page=index_begining;
    this.no_results = false;
    
    this.dishService.get_products_order_detail(orderdetail_id).subscribe(
     
      res=> { 
        this.order_detail=res;     
        this.loading_modaldetail_gif=false;  
        document.body.style.cursor = 'default';      
      },
      err=> {
        
        this.no_results=true,
        this.loading_modaldetail_gif=false,
        document.body.style.cursor = 'default'
        } 
    );
  }

  
  orderitems_detail: any =[];
  //public loading_modaldetail_gif : any|boolean;
  get_orderitems_detail(orderdetail_id: number)
  {
     
    this.orderitems_detail = [];
    /**PONER EL CURSOR EN MODO ESPERA */
    document.body.style.cursor = 'wait';
    this.loading_modaldetail_gif=true;
    //this.global_index_page=index_begining;
    this.no_results = false;
    //cantidad = this.global_category_count[0].count;
    //cantidad = this.global_category_count[0].count;*/
    //console.log("dato "+this.cantidad);
    this.dishService.get_orderitems_detail(orderdetail_id).subscribe(
     
      res=> { 
        this.orderitems_detail=res;     
        this.loading_modaldetail_gif=false;  
        document.body.style.cursor = 'default';
        console.log(this.orderitems_detail);      
      },
      err=> {
        
        this.no_results=true,
        this.loading_modaldetail_gif=false,
        document.body.style.cursor = 'default'
        } 
    );
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
