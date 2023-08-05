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
  selector: 'app-orders-list-completed',
  templateUrl: './orders-list-completed.component.html',
  styleUrls: ['./orders-list-completed.component.css']
})
export class OrdersListCompletedComponent implements OnInit {

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
   
  
     this.initial_function();
   
 }

  initial_function(){
  
   environment.pagevalue = 1;
   this.global_index_page = 0;
   this.orders_quantity();
   /**RECIBE INICIO DE FILTRO Y NUMERO DE PAGINA */    
   this.getOrders_count(this.global_index_page,environment.pagevalue);
   
   
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
     "note": "Hola mundo, este es el comentario",
     "products": [
         {
             "id_product": 10,
             "amount": 4,
             "sub_total": 80,
             "add_ons": [
                 {
                     "tag": "Ensalada de lechuga",
                     "price":0.25
                 }
             ]
         },
         {
             "id_product": 10,
             "amount": 5,
             "sub_total": 50,
             "add_ons": [
       
             ]
         },
         {
             "id_product": 10,
             "amount": 5,
             "sub_total": 100,
             "add_ons": [
                 {
                     "tag": "Salsa dulce",
                     "price": 0.50
                 },
                 {
                     "tag": "Salsa picamas",
                     "price": 0.50
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
 getOrders_count(index_begining: number,element_position : number)
 {
   environment.pagevalue = element_position;
   /**INICIAMOS A OBTENER LAS ORDENES
    * PONER EL CURSOR EN MODO ESPERA */
   document.body.style.cursor = 'wait';
   this.loading_gif=true;
   this.global_index_page=index_begining;
   this.no_results = false;
 
   this.dishService.getOrders_count(''+index_begining,'Completado').subscribe(
   
     res=> {

      
       this.order_info=res;     
       this.loading_gif=false;   
       document.body.style.cursor = 'default';
       this.verify_previusandnextpage(environment.pagevalue);     
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
   
   
 this.dishService.get_orders_quantity('Completado').subscribe(
   res=> {

     this.array_orders_count=res;   

    
     if(this.array_orders_count[0].count > 105)
     {
       this.array_orders_count[0].count = 105;
       
     }
   
     let suma_constante=0;

           
     let residuo=this.array_orders_count[0].count; 

     /** SUMA CONSTANTE TENDRA EL VALOR DE 0*/
     this.paging_array.push({"init" : suma_constante} );

     while(residuo > 0)
     {
         /** RESIDUO INICIALMENTE TIENE LA MISMA MAGNITUD QUE LA CANTIDAD DE PRODUCTOS, LUEGO SE VA RESTANDO POCO A POCO
          * HASTA LLEGAR A 0, ESO CON EL FIN DE DETERMINAR EL NUMERO DE PAGINAS (programacion recursiva)*/   
         if(residuo > 15 )
         {
           /**SI residuo es mayor que 10 quiere decir que hay mas de 10 y por lo tanto se va llenando un array con la
            * variable "suma_constante" que va aumentando de 10 en 10, la primera vez que lo hace tiene un valor de 10, luego,
            * si residuo sigue siendo mayor que 10 "suma_constante" vale 20, a la siguiente 30 y así sucesivamente.
           */
            suma_constante=suma_constante+15;
            this.global_sumatory=suma_constante;
          
            this.paging_array.push({"init" : suma_constante} );
            residuo=residuo-15;              
         }

         else if(residuo-15 == 0 || residuo-15 < 15 )
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
          this.getOrders_count(0,environment.pagevalue);
          this.websocketservice.delivery_order_alert();
          
         }
 
         if(res=="intern")
          {
          this.websocketservice.intern_order_alert(); 
          }

          });

          this.websocketservice.orderresponse.subscribe(res =>{
   
          
           if(res == true)
           {
              alert("hola");
           }

           if(res == false)
           {
              alert("error");
           }
           });          
          environment.Socket_state = 1;

     }

   }


   order_detail_info: any =[];
 /**Para cambiar la forma del cursor mientras se carga algo*/
public loading_modaldetail_gif : any|boolean;
 getOrder_detail_modal(order_id: number)
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
   this.dishService.get_order_detail(order_id).subscribe(
    
     res=> { 
       this.order_detail_info=res;     
       this.loading_modaldetail_gif=false;  
       document.body.style.cursor = 'default';    
       //console.log(res);  
     },
     err=> {
       
       this.no_results=true,
       this.loading_modaldetail_gif=false,
       document.body.style.cursor = 'default'
       } 
   );


 
   this.getOrder_detail(order_id);
   this.get_orderitems_detail(order_id);
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
       //console.log(this.order_detail);    
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
       //console.log(this.orderitems_detail);      
     },
     err=> {
       
       this.no_results=true,
       this.loading_modaldetail_gif=false,
       document.body.style.cursor = 'default'
       } 
   );
 }


 public loading_statebuton :boolean = false;
 update_ordersatate(order_id: number)
 {
  this.loading_statebuton=true; 
  document.body.style.cursor = 'wait';
     this.dishService.update_orderstate(order_id,'Procesando').subscribe(
        res =>{
         

           this.Update_orderstate_alert(res);  
           this.orders_quantity();             
           this.getOrders_count(this.global_index_page,environment.pagevalue);

           this.loading_statebuton=false;
           document.body.style.cursor = 'default';
        }
        ,
        err => {
          this.loading_statebuton=false;
          this.error_updating_state()
        
        } 
       
     )

 }

 Update_orderstate_alert(res : JSON | any)
 {
 
   const Toast = Swal.mixin({
     toast: true,
     position: 'top-end',
     showConfirmButton: false,
     timer: 3000,
     timerProgressBar: true,
     didOpen: (toast) => {
       toast.addEventListener('mouseenter', Swal.stopTimer)
       toast.addEventListener('mouseleave', Swal.resumeTimer)
     }
   })
   
   Toast.fire({
     icon: 'success',
     title: res
   })
  } 


  error_updating_state()
  {
    Swal.fire({
      icon: 'error',
      title: 'Lo sentimos...',
      text: 'No se completo la actualizacion!',
      footer: '<a >Notifique error</a>'
    })            

  }

 previuspage()
 {

    /**FUNCION PARA EL MANEJO DE FUNCION DE BOTONES "ANTERIOR" Y "SIGUIENTE" */
   //alert(this.global_index_page); 

    environment.pagevalue = environment.pagevalue-1; 
     this.global_index_page = this.global_index_page-15;      
     this.getOrders_count(this.global_index_page,environment.pagevalue); 
     this.verify_previusandnextpage(environment.pagevalue);
     
 }

 
  nextpage()
 {

    /**FUNCION PARA EL MANEJO DE FUNCION DE BOTONES "ANTERIOR" Y "SIGUIENTE" */
   //alert(this.global_index_page); 

   //if(environment.pagevalue < this.paging_array.length)
   {
     environment.pagevalue = environment.pagevalue+1; 
     this.global_index_page = this.global_index_page+15;      
     this.getOrders_count(this.global_index_page,environment.pagevalue); 
     //if(environment.pagevalue  > 0) 
     {
         //alert(environment.pagevalue);
         //this.previus_state = true;
         this.verify_previusandnextpage(environment.pagevalue);  
     }
   }
   
 }


 /**INICIALIZAMOS nextpage_state y previus_state con true porque si
  * lo inicializamos con false se genera un bug en el lado del front
  * en los botones siguiente y anterior
  */
 nextpage_state : boolean = true;
 previus_state : boolean = true;

 verify_previusandnextpage(element_position : number){

  if(this.paging_array.length == 1 ){

    this.nextpage_state = false;
    this.previus_state = false;
   }   

 if(this.paging_array.length > element_position){
   
   this.nextpage_state = true;
  
 }

 if(this.paging_array.length == element_position ){
   
   this.nextpage_state = false;

 }

 if( element_position > 1){
   
   this.previus_state = true;            
 }

 if( element_position == 1){
   
   this.previus_state = false;  
         
 }

 
 }

 userphone : string | any = '';


 async choose_option_call(userphone : string){
    
   this.userphone= userphone;
   
   Swal.fire({
     title: '<strong>Notificar al cliente</strong>',
     //icon: 'info',
     html:
      
       '<a href="https:////wa.me/+502'+this.userphone+', hemos recibido su pedido, le mantendremos al pendiente por su orden" target="_blank">' +
       '<button name="button" class="btn btn-primary btn-block" style="background: #25d366; border-color: transparent" ><i class="fa fa-whatsapp"></i> Mensaje via whatsapp</button>'+
       '</a> '+
       '<br> '+

       '<a href="tel:+502'+this.userphone+'" target="_blank">' +
        '<button name="button" class="btn btn-primary btn-block"> Llamada normal </button>'+
        '</a> '+
        '<br> ',
       
     showCloseButton: true,
     showCancelButton: false,
     showConfirmButton: true,
     /*focusConfirm: false,
     confirmButtonText:
       'Aceptar',
     confirmButtonColor: '#3085d6',
     confirmButtonAriaLabel: 'recibida',*/
     cancelButtonText:
       'Salir',
     cancelButtonAriaLabel: 'Thumbs down'
   })
   
}



}
