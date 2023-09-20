import { Component, OnInit } from '@angular/core';

import { Category } from 'src/app/models/Category';
import { Category_ins } from 'src/app/models/Category_ins';
import { Ruta } from 'src/app/models/Ruta';
import { Paging } from 'src/app/models/Paging';


import {DishService} from '../../services/dish.service';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';


import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';
import { Dish_ins } from 'src/app/models/Dish_ins';
import { Dish_edit_register } from 'src/app/models/Dish_edit_register';
import { Dish_edit } from 'src/app/models/Dish_edit';
import {WebSocketService} from '../../services/web-socket.service';

import {SharingService,Component_dat} from '../../services/sharing.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {JsonwtService,Component_token} from 'src/app/services/jsonwt.service'



@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})




export class DishListComponent implements OnInit {

 /**Para cambiar la forma del cursor mientras se carga algo*/
public loading_gif : any|boolean;


 
  dish_info: any =[];
 
  

 public file: any| File;

 
 API_URI: ArrayBuffer| string=environment.API_URI;
 

/**Variables para imagen de editar categoría */
IMAGE_DIRECTORY_EDIT: string = "";


 public archivos : any= [];
 selectedOptions =[];

 data$: Observable <Component_dat>;
 Token$: Observable<Component_token> | undefined;
 /*datos : string | any;]*/
  //value: Subscription;
 constructor(private dishService: DishService,private router: Router,private activedRoute: ActivatedRoute, private sanitizer: DomSanitizer, private http: HttpClient, 
    private websocketservice : WebSocketService , private sharingservice : SharingService, private cookiesvc : CookieService)
     { 

        /**los datos del obserbable son para mostrar en la aplicacion y los datos de dish_register.image son 
     * los que se guardan
     */
        this.data$= sharingservice.SharingObservable;
        /**datos a mostrar */
        this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"} 
        /**datos a guardar, se tiene que enviar la direccion completa de donde estan guardadas las 
         * imagenes porque la locacion de las imagenes puede cambiar
        */
        environment.Dish_image="uploads/no_image.png";
        //this.Token$= tokenSvc.TokenObservable;
        //this.Token$= tokenSvc.TokenObservable;
        /*this.value = this.tokenSvc.TokenObservable.subscribe(value => {
          this.datos = value.Token;
        });
        
        console.log(''+this.datos)*/
        
      

   this.Socket_config();    

     }


  ngOnInit(): void {

    environment.pagevalue = 1;
    this.global_index_page = 0;
    this.getCategories();
    this.clasify_filter();
    this.verify_previusandnextpage(environment.filter_var);
    this.Selected_option= environment.filter_var;
    
    
  }
  
  ruta: Ruta =
  {
    route:''
  }; 
  
  /*LA ESTRUCTURA category_ins ES SIMILAR A LA ESTRUCTURA category_temporal pero son utilizados en funciones diferentes a
  pesar de que son iguales en su contenido difieren en su funcion */
  dish_ins: Dish_edit =
  {
    id_product:0,
    name:'',
    description:'',
    price: '',
    image:'',
    is_enable:0,
    has_image:0,
    button_enable: true
  };

  /*ESTRUCTURA PARA REALIZAR TAREAS TEMPORALES QUE REQUIEREN ALGUNOS CAMBIOS SOBRE LA ESTRUCTURA DE categori_ins*/ 
  category_temporal: Category =
  {
    id_category:0,
    name:'',
    description:'',
    image:'',
    has_image:0
  };

   /**INICIALIZAMOS nextpage_state y previus_state con true porque si
   * lo inicializamos con false se genera un bug en el lado del front
   * en los botones siguiente y anterior
   */
  nextpage_state : boolean = true;
  previus_state : boolean = true;
  
  selectbypage( index_page : number, element_position : number){
   
     this.global_index_page= index_page;
    
    if( environment.filter_var == -1 )
    {
     
      environment.pagevalue = element_position;
     
      this.getProducts_pagecount(index_page);
    }

    if( environment.filter_var >= 1 )
    {
     
      environment.pagevalue = element_position;
      /**recibe el id de la categoría seleccionada */
      
      this.filterby_category(environment.filter_var);
    }

  }


  nextpage()
  {

     /**FUNCION PARA EL MANEJO DE FUNCION DE BOTONES "ANTERIOR" Y "SIGUIENTE" */
    //alert(this.global_index_page); 
      environment.pagevalue = environment.pagevalue+1; 
      this.global_index_page = this.global_index_page+10;      
      this.getProducts_pagecount(this.global_index_page); 
      this.verify_previusandnextpage(environment.pagevalue);  
    
  }

  previuspage()
  {

     /**FUNCION PARA EL MANEJO DE FUNCION DE BOTONES "ANTERIOR" Y "SIGUIENTE" */
    //alert(this.global_index_page); 

      environment.pagevalue = environment.pagevalue-1; 
      this.global_index_page = this.global_index_page-10;      
      this.getProducts_pagecount(this.global_index_page);
       
      this.verify_previusandnextpage(environment.pagevalue);
     
  }
 

  verify_previusandnextpage(element_position : number){

    if(this.paging_array.length == 1 ){
      this.nextpage_state = false;
      this.previus_state = false;
  }

  if(this.paging_array.length > element_position ){
    
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


   constante=0;
   LIST_DIREC: string ="";    
   /**variable para indicar si hay o no resultados de consulta */
   no_results : boolean = false;
  getProducts_pagecount(index_begining: number)
  {
       
        /**PONER EL CURSOR EN MODO ESPERA */
        document.body.style.cursor = 'wait';
    
    this.loading_categories_combo = true; 
    this.loading_gif=true;
    this.no_results = false;
    this.global_index_page=index_begining;
    
    this.dishService.getProducts(''+index_begining).subscribe(
    
      res=> {

       // console.log(res);
        this.dish_info=res;     

        this.loading_gif=false;   

            /**PONER EL CURSOR EN MODO ESPERA */
             document.body.style.cursor = 'default';    
             this.verify_previusandnextpage(environment.pagevalue);
             this.loading_categories_combo = false; 
      },
      err=> {
        //alert("hola"+err);
        this.no_results=true,
        this.loading_gif=false,
        this.loading_categories_combo = false; 
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
    
    /**LIMPIAMOS EL ARRAY QUE SE TIENE DESDE UN INICIO PARA PAGINACION*/
    this.paging_array=[];

    /**PAGINACION QUE SE LLEVA A CABO PARA VER CUANTOS PRODUCTOS EXISTEN,
     * COMIENZA CON UN CONTEO, LUEGO SE EJECUTA EL ALGORITMO DE PAGINACION
    */
    
    
  this.dishService.getproductsquantity().subscribe(
    res=> {

      this.array_product_count=res;     
    
      let suma_constante=0;
      let residuo=this.array_product_count[0].count; 
      
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


getproductsquantity_onfilter(id_category : number){
    
  /**LIMPIAMOS EL ARRAY QUE SE TIENE DESDE UN INICIO PARA PAGINACION*/
  this.paging_array=[];

  /**PAGINACION QUE SE LLEVA A CABO PARA VER CUANTOS PRODUCTOS EXISTEN,
   * COMIENZA CON UN CONTEO, LUEGO SE EJECUTA EL ALGORITMO DE PAGINACION
  */
  
  
this.dishService.getproductsquantity_onfilter(id_category).subscribe(
  res=> {

    this.array_product_count=res;     
  
    let suma_constante=0;
    let residuo=this.array_product_count[0].count; 
    
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


  
category: any =[];
getCategories()
  {
        /**PONER EL CURSOR EN MODO ESPERA */
    document.body.style.cursor = 'wait';
    this.loading_gif=true;
    this.no_results = false;
     
    this.dishService.getCategories().subscribe(
    
      res=> {

        this.category=res;  
      
        this.loading_gif=false;    
        document.body.style.cursor = 'default';       
      },
      //err=> console.error(err)
       err=> {
        //alert("hola"+err);
        this.no_results=true,
        this.loading_gif=false,
        document.body.style.cursor = 'default'
        /*,
       document.body.style.cursor('default')*/} 
    );
  }

  
/**Selected_option es una variable de uso ngModel en el Front*/
Selected_option: number  = 0; 
//varselection: number     = -1;

capture() {
  // Pasamos el valor seleccionado a la variable verSeleccion
  environment.filter_var = this.Selected_option;   
  this.global_index_page=0;
  this.clasify_filter();
}

loading_categories_combo : boolean = false;

clasify_filter(){

  /**Verifica el tipo de busqueda que se realiza.
   *  1 o mayor a 1 busqueda específica
   * -1, Todos los productos
   *  0, productos sin categoría
  */
  if(environment.filter_var >= 1){

      
      environment.pagevalue = 1;
      /**Recibe el id */
      this.getproductsquantity_onfilter(environment.filter_var);
      this.filterby_category(environment.filter_var);
    
   }

   
  if(environment.filter_var == -1){
    this.products_quantity_initial();
    this.getProducts_pagecount(this.global_index_page);   
  }

   
}

filterby_category(idto_filter: number)
  {
       
       
        /**PONER EL CURSOR EN MODO ESPERA */
        document.body.style.cursor = 'wait';
    
    this.loading_categories_combo = true;
    this.loading_gif=true;
    this.no_results = false;
    //this.global_index_page=index_begining;
    
    this.dishService.getProducts_byfilter(''+idto_filter,''+this.global_index_page).subscribe(
    
      res=> {

       // console.log(res);
        this.dish_info=res;     

        this.loading_gif=false;   

            /**PONER EL CURSOR EN MODO ESPERA */
              document.body.style.cursor = 'default';    
              this.verify_previusandnextpage(environment.pagevalue); 
              this.loading_categories_combo = false;
 
      },
      err=> {
        //alert("hola"+err);
        this.loading_categories_combo = false;
        this.no_results=true,
        this.loading_gif=false,
        document.body.style.cursor = 'default'
        } 
    );
  }


  

  value_toggle : boolean  = true;
  value_toggle2 = false;
  opcion1= true;
  
      /**REGISTRA EL EVENTO QUE SE GENERA AL DARLE CLICK A LA HORA DE SELECCIONAR CUALQUIER CHECK BOX */
      
  onNgModelChange(){
    /*IGUALAMOS selected_list PORQUE selectedOptions tiene el listado de datos que han sido seleccionados, el valor de selectedOptions      
    */
    

    if(this.dish_ins.button_enable ==true)
    {
       this.dish_ins.button_enable = false;
       this.dish_ins.is_enable=0;
    }
    
    
    else if(this.dish_ins.button_enable == false)
    {
       this.dish_ins.button_enable =true;
       this.dish_ins.is_enable=1;
    }

   
    
  
  }

  Product_to_edit(id_product : number){
    
      //environment.id_product_toedit=id_product;
      this.cookiesvc.set('productid',''+id_product,2,'/dishes');
      this.cookiesvc.set('productid',''+id_product,2,'/'  ); 
  }


  Image_temporal :string ="";
  Image_temporal_edit :string="";

  estado_imagen: string="";

  get_src_image(direc : string)

  {
   
    /**funcion para llenar la imagen a la hora de guardar una categoría */


      /*La variable IMAGE_DIRECTORY_SAVE es la que se usa en el image de la ventana de insersion así que si el estado es 'insert' 
      se va a trabajar con el form nueva categoría.
      */

      if(this.estado_imagen=='insert')
      {
      
        this.IMAGE_DIRECTORY_SAVE=direc;
        

      /*Image_temporal guarda el nombre de la imagen que se ha escogido desde la galería*/ 
      this.Image_temporal=this.API_URI+this.IMAGE_DIRECTORY_SAVE;
      }
      
      /**si es edit, se va a trabajar con el formulario edit */
      if(this.estado_imagen=='edit')
      {
        this.IMAGE_DIRECTORY_EDIT=direc;
         /*Image_temporal_edit guarda el nombre de la imagen que se ha escogido desde la galería Y
         por medio de esta se muestra en el formulario de edicion*/ 
        this.Image_temporal_edit=this.API_URI+this.IMAGE_DIRECTORY_EDIT;
        
      }
       
     
  }

  assign_no_image(){  
   
     /*ASIGNAMOS LA IMAGEN SELECIONADA DEL MODELO QUE ES LO QUE SE GUARDARÁ, el observable no se guarda
     unicamente sirve para mostrar*/
     environment.Dish_image="uploads/no_image.png";
     this.dish_ins.image=environment.Dish_image;
      
     /**CAMBIAMOS EL VALOR DEL OBSERVABLE PARA QUE TAMBIEN ACTUALICE SU VALOR DE IMAGEN
      */
     
     this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"}   
  }



   /**Variables para imagen de nueva ategoría */
 IMAGE_DIRECTORY_SAVE: string = "";
  
  
   
  editProduct_quickly()
  {      

       /** le damos la ruta que se asigno a la variable environment.Dish_image PUES EN ELLA
        * ESTA LA DIRECCION DE LA IMAGEN
        */
       if(environment.Dish_image!="uploads/no_image.png")
       {
        
        //alert(environment.Dish_image);
        this.dish_ins.image=environment.Dish_image;
        this.dish_ins.has_image=1;                 
       }

       if(environment.Dish_image=="uploads/no_image.png")
       {
       
        this.dish_ins.image="uploads/no_image.png";
        //alert(this.dish_ins.image);
        this.dish_ins.has_image=0;                 
       }

       if(this.dish_ins.name != null && this.dish_ins.name != "" 
        && this.dish_ins.price != null && this.dish_ins.price != "")
       {
        
        this.edit_quickly(this.dish_ins);    
       }

       else if(this.dish_ins.name != null || this.dish_ins.name != "" || 
        this.dish_ins.price != null || this.dish_ins.price != "")
       {
        
            this.error_incomplete_items();
       }
    
  }

  
  edit_quickly(sish : Dish_edit){

    this.loading_gif=true;

    this.dishService.editProduct_quickly(this.dish_ins).subscribe(
      res =>{
       

        this.limpiar_campos();
        
        if(environment.filter_var >= 1){
          environment.pagevalue = 1;
          /**Recibe el id */
          this.filterby_category(environment.filter_var);
       }
    
       
      if(environment.filter_var == -1){         
        this.getProducts_pagecount(this.global_index_page);   
      }


        //this.getProducts_pagecount(this.global_index_page);
        this.Save_product_changes_alert(res);
        this.loading_gif=false;
      },
      err => console.log(err)
     
   )


  }

  deleteDish(){

    
    this.dishService.deleteDish(''+this.dish_ins.id_product).subscribe(
     res=> {
       
       /**Mandamos cat para indicar que es una categoría la que se elimina y así darle su respectiva alerta */
       this.alerta_elemento_eliminado("cat");
        
       this.getProducts_pagecount(this.global_index_page);
       
     },
     err=> console.error(err)
    )
  }





  limpiar_campos()
  {  
    
    this.dish_ins.id_product=0;
    this.dish_ins.name='';
    this.dish_ins.description='';
    this.dish_ins.image='';
    this.Image_temporal='';  

  }
  


  map_product(product: Dish_edit_register)
  {
     /*Recibe la estructura de categoría a traves de parametro y se lo asigna a la estructura categoty_ins para su 
     utilizacion en el frontend
     */    
   
    this.dish_ins.id_product=product.id_product;
    this.dish_ins.name=product.name;
    this.dish_ins.description=product.description;  
    this.dish_ins.price=product.price;
     
    this.dish_ins.image=product.image; 
    environment.Dish_image = ""+this.dish_ins.image; 
    this.sharingservice.SharingObservableData =  {location : environment.API_URI+product.image}
    //alert(this.dish_ins.image);
    //this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"}  
    this.dish_ins.is_enable=product.is_enable;
    
    if(this.dish_ins.is_enable == 1)
    {
      this.dish_ins.button_enable = true;
    }
    
    if(this.dish_ins.is_enable == 0)
    {
      this.dish_ins.button_enable = false;
    }

    this.Image_temporal_edit=""+this.API_URI+product.image;
    
    /**le avisamos que vamos a editar */
    this.estado_imagen='edit';
  }

dish_image: string = "";

alerta_elemento_eliminado(elemento : String){
  
  if(elemento="cat")
  {    

    Swal.fire({
      title: 'Producto eliminado',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })

    }

    }

    Save_product_changes_alert(res : JSON | any)
    {
    
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
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


    error_incomplete_items()
    {
      Swal.fire({
        icon: 'error',
        title: 'Por favor...',
        text: 'Los campos de nombre y precio son obligatorios!',
        footer: '<a >Complete los campos que se le piden</a>'
      })            
  
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
