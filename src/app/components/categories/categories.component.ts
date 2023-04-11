import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { Category_ins } from 'src/app/models/Category_ins';
import { Ruta } from 'src/app/models/Ruta';
import { Paging } from 'src/app/models/Paging';

import {DishService} from '../../services/dish.service';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import {WebSocketService} from '../../services/web-socket.service';
import {SharingService,Component_dat} from '../../services/sharing.service';

import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Gallery_element } from 'src/app/models/Gallery_element';
import {environment} from 'src/environments/environment';
import { delay } from 'rxjs';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';
import { BehaviorSubject, Observable } from 'rxjs';





interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

 /**Para cambiar la forma del cursor mientras se carga algo*/
public loading_gif : any|boolean;

  category: any =[];
  array_category_count : any =[];
 
  


 
 API_URI: string=environment.API_URI;
 

/**Variables para imagen de editar categoría */
IMAGE_DIRECTORY_EDIT: string = "";

  data$: Observable <Component_dat>;
 
  constructor(private dishService: DishService,private router: Router,private activedRoute: ActivatedRoute, private sanitizer: DomSanitizer, private http: HttpClient, private websocketservice : WebSocketService, private sharingservice : SharingService) { 
      
         /**los datos del obserbable son para mostrar en la aplicacion y los datos de dish_register.image son 
     * los que se guardan
     */
         this.data$= sharingservice.SharingObservable;
         /**datos a mostrar */
         this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"} 
         /**datos a guardar, se tiene que enviar la direccion completa de donde estan guardadas las 
          * imagenes porque la locacion de las imagenes puede cambiar
         */
         environment.Dish_image="uploads/no_image.png"
    
    this.Socket_config();

  }


  ngOnInit(): void {
   
    
    this.getcategories_quantity();
    
    this.getCategories(0);  
    
  }


 
  ruta: Ruta =
  {
    route:''
  }; 
  
  /*LA ESTRUCTURA category_ins ES SIMILAR A LA ESTRUCTURA category_temporal pero son utilizados en funciones diferentes a
  pesar de que son iguales en su contenido difieren en su funcion */
  category_ins: Category_ins =
  {
    id_category:0,
    name:'',
    description:'',
    image:'',
    has_image:0,
    selected:'',
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

 

 
   constante=0;
   LIST_DIREC: string ="";
   no_results : boolean = false;
  getCategories(index_begining: number)
  {
        /**PONER EL CURSOR EN MODO ESPERA */
    document.body.style.cursor = 'wait';
    this.loading_gif=true;
    this.no_results = false;
    this.global_index_page=index_begining;
    
    this.dishService.getCategories_pagecount(''+index_begining).subscribe(
    
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

  global_index_page=0;
  global_sumatory=0;
  paging_array: any =[];

  getcategories_quantity(){
    
    /**LIMPIAMOS EL ARRAY QUE SE TIENE DESDE UN INICIO PARA PAGINACION*/
    this.paging_array=[];

    /**PAGINACION QUE SE LLEVA A CABO PARA VER CUANTAS CAGEGORÍAS EXISTEN,
     * COMIENZA CON UN CONTEO, LUEGO SE EJECUTA EL ALGORITMO DE PAGINACION
    */
    
    
  this.dishService.getcategoriesquantity().subscribe(
    res=> {

      this.array_category_count=res;     
    
      let suma_constante=0;
      let residuo=this.array_category_count[0].count; 
      
      /** SUMA CONSTANTE TENDRA EL VALOR DE 0*/
      this.paging_array.push({"init" : suma_constante} );

      while(residuo > 0)
      {
          /** RESIDUO INICIALMENTE TIENE LA MISMA MAGNITUD QUE LA CANTIDAD DE CATEGORÍAS, LUEGO SE VA RESTANDO POCO A POCO
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


  Image_temporal :string ="";
  Image_temporal_edit :string="";

  estado_imagen: string="";


  assign_no_image(){  
  
    /*ASIGNAMOS LA IMAGEN SELECIONADA DEL MODELO QUE ES LO QUE SE GUARDARÁ, el observable no se guarda
     unicamente sirve para mostrar*/
    environment.Dish_image="uploads/no_image.png";
    this.category_ins.image=environment.Dish_image;
    
    /**CAMBIAMOS EL VALOR DEL OBSERVABLE PARA QUE TAMBIEN ACTUALICE SU VALOR DE IMAGEN
     */
    
    this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"}     
  }

   /**Variables para imagen de nueva ategoría */
 
  
  saveCategory()
  {
        
        
     
        this.category_ins.selected='0';
        //environment.Dish_image= this.sharingservice.SharingObservableData.location;

     
         /*COMPROBAMOS SI HAY ALGUNA IMAGEN EN EL DIRECTORIO*/
        if(environment.Dish_image =='uploads/no_image.png')
        {
          /**LE INDICAMOS QUE NO VA A TENER IMAGEN EN EL CAMPO has_image */
          this.category_ins.has_image=0;
        }

        else if (environment.Dish_image !='uploads/no_image.png')
        {
          
          this.category_ins.has_image=1;  
        }
       
       /** se hace un cambio en el campo src_image para que unicamente guarde el valor de el directorio de la imagen*/
       /*this.category_ins.image=this.IMAGE_DIRECTORY_SAVE;*/
       
        /**ASIGNAMOS LA IMAGEN ACTUAL EN LA VARIABLE DE ENTORNO DE IMAGEN */
      this.category_ins.image=environment.Dish_image;
        
       document.body.style.cursor = 'wait';
       this.dishService.saveCategory(this.category_ins)
     .subscribe(
        res =>{
      

          this.limpiar_campos();         
          this.getcategories_quantity();
          this.getCategories(0);
          document.body.style.cursor = 'default';
          this.alerta_categoria("a")
        },
        err => console.log(err)
       
     )

    
  }

   
  editCategory()
  {      
           /**ASIGNAMOS LA IMAGEN ACTUAL EN LA VARIABLE DE ENTORNO DE IMAGEN */
           //this.category_ins.image=environment.Dish_image;
                
          
       /** le damos la ruta que se asigno a la variable environment.Dish_image PUES EN ELLA
        * ESTA LA DIRECCION DE LA IMAGEN
        */
       if(environment.Dish_image!="uploads/no_image.png")
       {
    
        this.category_ins.image=environment.Dish_image;
        this.category_ins.has_image=1;                 
       }

       if(environment.Dish_image=="uploads/no_image.png")
       {
        
        this.category_ins.image="uploads/no_image.png";
        this.category_ins.has_image=0;                 
       }
       
 
     this.dishService.editCategory(this.category_ins)
      

     .subscribe(
        res =>{
         
          this.limpiar_campos();
          this.getCategories(this.global_index_page);
           
          this.Save_category_changes_alert(res);
           //alert(res);
        },
        err => console.log(err)
       
     )

    
  }

  

  deleteCategory(){

    
    this.dishService.deleteCategory(''+this.category_ins.id_category).subscribe(
     res=> {
   
       /**Mandamos cat para indicar que es una categoría la que se elimina y así darle su respectiva alerta */
       this.alerta_elemento_eliminado("cat");
       this.getcategories_quantity(); 
       this.getCategories(this.global_index_page);
       
     },
     err=> console.error(err)
    )
  }



  /* cuando creamos una categoría, limpiamos los campos corrrespondientesy tambien le avisamos al estado 
  de la imagen que se va a ingresar una nueva imagen, así desde la galería vamos a cargar la imagen a la variable
  adecuada, hay una variable para mostrar la imagen en NUEVA CATEGORÍA y una para EDITAR CATEGORIÍA */ 
  new_category_clean()
  {
     /**tiene casi lo mismo que limpiar_campos() a diferencia de que acá se indica el estado para distingir el tipo de 
      * operacion que se va a hacer con la imagen si se va a isertar o se va a editar, en este caso es la imagen para insertar
      */
    this.category_ins.id_category=0;
    this.category_ins.name='';
    this.category_ins.description='';
    this.category_ins.image='/assets/img/no_image.png';
    this.Image_temporal='';  

    this.estado_imagen='insert';
    environment.Dish_image="uploads/no_image.png"
    this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"} 
  }


  limpiar_campos()
  {  
    
    this.category_ins.id_category=0;
    this.category_ins.name='';
    this.category_ins.description='';
    this.category_ins.image='';
    this.Image_temporal='';  

  }
  



  map_category(cate: Category)
  {
     /*Recibe la estructura de categoría a traves de parametro y se lo asigna a la estructura categoty_ins para su 
     utilizacion en el frontend
     */    
    this.category_ins.id_category=cate.id_category;
    this.category_ins.name=cate.name;
    this.category_ins.description=cate.description;   
    this.category_ins.image=cate.image;  
    //alert(this.category_ins.image);
     environment.Dish_image=""+cate.image;
    //this.Image_temporal_edit=""+this.API_URI+cate.image;
    this.sharingservice.SharingObservableData =  {location : this.API_URI+cate.image} 
    
    /**le avisamos que vamos a editar */
    this.estado_imagen='edit';
  }
 



alerta_categoria(tipo: string)
{

/**a platillo agregado
 * 
 */

if(tipo = "a"){

  Swal.fire(
    'Categoria agregada!',
    'Revise en orden alfabetico',
    
  )
} 

}


alerta_elemento_eliminado(elemento : String){
  
  if(elemento="cat")
  {    

    Swal.fire({
      title: 'Categoría eliminada',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })

    }

    }

    Save_category_changes_alert(res : JSON | any)
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

  
}
