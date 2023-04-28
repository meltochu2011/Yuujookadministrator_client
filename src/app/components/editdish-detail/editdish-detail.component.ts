import { Component, HostBinding, OnInit,NgModule } from '@angular/core';
import { Dish } from 'src/app/models/Dish';
import { Category_ins } from 'src/app/models/Category_ins';

import { Group } from 'src/app/models/Group';

import {DishService} from '../../services/dish.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Gallery_element} from 'src/app/models/Gallery_element';
import Swal from 'sweetalert2';
import {FormGroup,FormControl,FormArray,Validators, FormBuilder} from '@angular/forms';
import { Dish_register } from 'src/app/models/Dish_register';
import { environment } from 'src/environments/environment';

import {WebSocketService} from '../../services/web-socket.service';
import {SharingService,Component_dat} from '../../services/sharing.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';



@Component({
  selector: 'app-editdish-detail',
  templateUrl: './editdish-detail.component.html',
  styleUrls: ['./editdish-detail.component.css']
})
export class EditdishDetailComponent implements OnInit {

  data$: Observable <Component_dat>;
  public formParent: FormGroup = new FormGroup({});
 

  constructor(private dishService: DishService, private router: Router, private activedRoute: ActivatedRoute,private fb : FormBuilder, private sharingservice : SharingService , private websocketservice : WebSocketService, private cookiesvc : CookieService) { 
   
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


  id_prod : number = 0;

  ngOnInit () {

   this.initFormParent();

       this.id_prod = parseInt(this.cookiesvc.get('productid'));

   /**INICIALIZAMOS LA IMAGEN EN EL MODELO PARA QUE NO TENGA NINGUNA AL INICIO */
      if( this.id_prod > 0)
      {
       
        this.initial_loading();
      
      }

      if(this.id_prod == 0)
      {
        this.no_results= true;
      }
      
  }


   
  initial_loading(){
    this.get_product_detail(this.id_prod);
    this.getGroup_items(this.id_prod);

    this.getCategories();
    this.getSelected_categories(this.id_prod);
  }

  add_groups(par_name:string, par_max_selected : number): void{
    /**FUNCION QUE AGREGA LOS GRUPOS AL ARRANQUE DEL PROGRAMA */
    const refitems= this.formParent.get('group_item_options') as FormArray;
  
    refitems.push(this.return_parents_values(par_name,par_max_selected)) 
   
  }

  add_items(par_signal:number, par_tag : string, par_price: string): void{
    /**FUNCION QUE AGREGA LOS ITEMS QUE PERTENCEN A LOS GRUPOS AL ARRANQUE DEL PROGRAMA */
    const refitems= this.formParent.get('dinamicos') as FormArray;
  
    refitems.push(this.return_sons_values(par_signal,par_tag, par_price)) 
   
  }

  return_parents_values(par_name : string, par_max_selected : number): FormGroup{    
      /*FUNCION QUE RETORNA LOS VALORES DE LOS PADRES QUE SE INGRESAN AL INICIO DEL PROGRAMA*/
   return new FormGroup(
       {            
         name: new FormControl(par_name,[Validators.required]),
         max_selected: new FormControl(par_max_selected,[Validators.required]),
         /*VARIABLE PARA INDICAR SI HAY ELEMENTOS HIJOS PARE EL ELEMNTO PADRE, TANTO EL ELEMNTO PADRE COMO EL ELEMENTO HIJO SON SIMBOLICOS
          PUES LOS DOS FORMS SON HIJOS SOLO QUE POR LA ESTRUCTURA, UN ARRAY REPRESENTA A LOS GRUPOS Y EL OTRO A LOS ITEMS DE LOS GRUPOS 
         */
         has_sons: new FormControl(1)        
             
       }
       
     )
           
 }

 return_sons_values(par_signal : number,par_tag : string, par_price : string): FormGroup{
  return new FormGroup(        
    {            
      /**el campo signal unicamente es el encargado de obtener el valor del hijo seleccionado en el momento en que se elije ver el detalle de grupo
       * como el valor del hijo es global solo obtenemos su valor, así cuando se crea un nuevo hijo ese valor se conserva y registra el hijo o index
       * del grupo seleccionado, Global_child representa el valor del index del grupo seleccionado en el momento presionar el boton para ver el detalle
       * del grupo
       */
      signal: new FormControl(par_signal),
      tag: new FormControl(par_tag,[Validators.required]),
      price: new FormControl(par_price,[Validators.required]),

    }        
  )
}


  dish: Dish =
    {
      id:0,
      title:'',
      description:'',
      image:'',
      
    };


    dish_register_temporal: Dish_register =
    {
      /**este sirve unicamente para comparar los cambios que se hicieron en la edicion del platillo
       * se compara la estructura final(editado) con la estructura inicial (no editado).
       */
      id_product:0,
      name: '',
      description : '',
      price: '',
      image: '',
      selected_list: [], /*PARA LA LISTA DE CAGEGORÍAS SELECCIONADAs*/
      group_list : [],
      sons_list : [],
      
    }


    dish_register: Dish_register =
    {
      id_product:0,
      name: '',
      description : '',
      price: '',
      image:'',
      selected_list: [], /*PARA LA LISTA DE CAGEGORÍAS SELECCIONADAs*/
      group_list : [],
      sons_list : [],
      is_enable:0,
      /**VALORES PARA CONTROL DE FUNCIONALIDAD */
      button_enable: true,
      static_fields_var: true,
      group_list_var : true,
      sons_list_var : true,
      selected_list_var: true
    }

    /*agregado temporalment*/
    category_ins: Category_ins =
  {
    id_category:0,
    name:'',
    description:'',
    image:'',
    has_image:0
  };
    
  

  group : Group =
  {
    name: '',
    max_selected: ''
  };


    gallery_element: Gallery_element=
    {
      id_gallery:0,
      src_image: ''
    }

    
    
    category: any =[];
    selectedOptions: any=[];

    selected_list:any =[];
    selected_list_temporal:any =[];
    
    
    add_item_array:any =[];
    
    API_URI: ArrayBuffer| string=environment.API_URI;

   
    public file: any| File;
    
    
    //public loading : any|boolean;
    public loading_button_edit : any|boolean;
    

    groupitems_array: any =[];

    getGroup_items(id_product: number)
    {
       /**FUNCION PARA CARGAR LOS GRUPOS E ITEMS A EDITAR DURANTE LA CARGA DE DATOS
        * SE RECORRE EL ARRAY EN FORMA ANIDADA PUES SON ARRAYS DENTRO DE OTRO ARRAY*/    
     
         //this.loading=true;
       this.dishService.get_products_items(id_product).subscribe(
        res=> {
  
          this.groupitems_array=res;  
           
          /**EMPEZAMOS A LEER LOS DATOS QUE HAY DENTRO DE groupitems_array y empezamos a
           * analizarlo para poder extraer los datos del mismo 
           */
          for(let i=0; i <this.groupitems_array.length; i++)
          {
    
            let group_elemnts =this.groupitems_array[i][0];
         
            /**LLENAMOS LOS ELEMENTOS DEL ARRAY DE GRUPOS ES DECIR EL ARRAY QUE SERÁ EL PADRE*/
            this.add_groups(group_elemnts.name,group_elemnts.max_selected);
            
            
                for(let j=0; j <this.groupitems_array[i].length; j++)
                {
                   let items_elements = this.groupitems_array[i][j]; 
                   this.add_items(i,items_elements.tag,items_elements.price);
                }

          }

          this.dish_register_temporal.group_list=this.formParent.value.group_item_options;
          this.dish_register_temporal.sons_list=this.formParent.value.dinamicos;
          
                  
        },
        err=> console.error(err)
      );
  


    }

        
    getSelected_categories(id_category : number){
             
  
      this.dishService.getSelected_categories(id_category).subscribe(
        res=> {
          
              this.selected_list=res;      
              this.dish_register_temporal.selected_list=res;               
        },

        err => console.error(err)
      );

    }
   
    cont : number = 0 ;

    Show_selected(){
      if(this.cont == 0)
      {
            /**FUNCION PARA SOLUCIONAR EL BUG QUE SE PRESENTA A LA HORA DE CARGAR LAS CATEGORÍAS
             * QUE PERTENECEN AL PRODUCTO EN EL PRIMER CLICK QUE SE LE HACE AL BOTON 
             * "Elejir o cambiar categoría" ES UNA SOLUCION ALGO DIFICIL DE ENTENDER PERO FUNCIONA
             * (Solucion intuitiva).  
             * EN EL PRIMER CLICK QUE SE LE DA AL BOTON ANTES MENCIONADO SE GENERA UN BUG POR ESO
             * CUANDO EL CONTADOR ES 0, OSEA CUANDO AUN NO SE LE HA DADO CLICK SE CARGAN LAS CATEGORIAS
             * A LAS QUE PERTENECE UN PRODUCTO A NIVEL DE FRONTEND, Y SE GENERA UN EVENTO SIMULADO
             * (this.onNgModelChange(event)) ESTE EVENTO AYUDA A QUE NO SE GENERE EL BUG PERO LIMPIA
             * EL LISTADO DEL ARRAY selected_list, ASI QUE SE RECARGA EL ARRAY DE NUEVO YA QUE ES
             * EL PRIMER CLICK SOBRE EL BOTON NO AFECTA AL LISTADO PUES PRACTICAMENTE SE SE CARGA LA
             * MISMA INFORMACION EN DICHO ARRAY 2 VECES. DE ALLI EN ADELANTE YA NO ES NECESARIO Y POR
             * ESO SOLO SE EJECUTA CUANDO EL CONTADOR ES IGUAL A 0. UNA SOLUCION ALGO LOCA PERO NO
             * ENCONTRE OTRA FORMA.
             * 
             */

               for (let i = 0; i < this.category.length; i++)
               {
                   for (let j = 0; j < this.selected_list.length; j++)
                    {
                         if(this.category[i].id_category == this.selected_list[j].id_category)
                         {
                           
                             this.category[i].selected = "1";
                       
                         }
                         
                    }    
               } 
              
              this.onNgModelChange(event)
              this.getSelected_categories(this.id_prod)
          
              
              this.cont++;
            }
    }
  
    loading_gif : boolean= false;
    no_results : boolean = false;
  getCategories()
  {
      

    document.body.style.cursor = 'wait';
    this.loading_gif=true;
    this.no_results= false;
    /**VACIAMOS EL ARRAY CATEGORY ANTES DE ASIGNARLE LOS VALORES, PORQUE GENERABA ERROR */
    //this.category=[];
    this.dishService.getCategories().subscribe(
      res=> {
 
        this.category=res;  
     
        document.body.style.cursor = 'default'; 
        this.loading_gif=false;  
          
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
  array_category_count: any =[];


     
      //selected_counter: number = this.selected_list.length;
   /**REGISTRA EL EVENTO QUE SE GENERA AL DARLE CLICK A LA HORA DE SELECCIONAR CUALQUIER CHECK BOX */
  onNgModelChange(event : any){
    /*IGUALAMOS selected_list PORQUE selectedOptions tiene el listado de datos que han sido seleccionados, el valor de selectedOptions      
    */
 
    this.selected_list=this.selectedOptions;

    
  }


  get result() {
    /**retornamos los valores que hay en el arreglo dishes_list que son los valoes de las categorías */
    return this.category.filter((item: { checked: boolean; }) => item.checked === true);

  }


  assign_no_image(){  
  
    /*ASIGNAMOS LA IMAGEN SELECIONADA DEL MODELO QUE ES LO QUE SE GUARDARÁ, el observable no se guarda
     unicamente sirve para mostrar*/
     environment.Dish_image="uploads/no_image.png";
     
    /**CAMBIAMOS EL VALOR DEL OBSERVABLE PARA QUE TAMBIEN ACTUALICE SU VALOR DE IMAGEN
     */
    
    this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"}     
  }

  

dish_data: any =[];

get_product_detail(id_product: number)
  {
    
    this.dishService.getProduct_detail(id_product).subscribe(
      res=> {

        this.dish_data=res;
        this.dish_register.id_product=this.dish_data[0].id_product;
        this.dish_register.name = this.dish_data[0].name;
        this.dish_register.price= this.dish_data[0].price;
        this.dish_register.description=this.dish_data[0].description;
        this.dish_register.image=this.dish_data[0].image;
         environment.Dish_image= this.dish_data[0].image;

        this.dish_register.is_enable= this.dish_data[0].is_enable;
        
        /**VERIFICAMOS EL VALOR DEL CAMPO is_enable para darle valor al boton en true
         * o false (para indicar la disponibilidad del platillo)
         */
        if(this.dish_register.is_enable == 1)
        {
          this.dish_register.button_enable= true;
        }

        if(this.dish_register.is_enable == 0)
        {
          this.dish_register.button_enable= false;
        }

        this.sharingservice.SharingObservableData =  {location : environment.API_URI+this.dish_register.image};

        /**com es la carga inicial igualamos los datos estaticos en la tabla comparativa*/
        this.dish_register_temporal.name = this.dish_data[0].name;
        this.dish_register_temporal.price= this.dish_data[0].price;
        this.dish_register_temporal.description=this.dish_data[0].description;
        this.dish_register_temporal.image=this.dish_data[0].image;
        this.dish_register_temporal.is_enable=this.dish_data.is_enable;
        
      
      },
      err=> console.error(err)
    );
      
  }

estado_imagen: string="";
IMAGE_DIRECTORY_SAVE: string = "";

/** VARIABLA PARA CUANDO SE SELECCIONA LA IMAGEN DESDE LA VENTANA PRINCIPAL */
Dish_image :string ="";



IMAGE_DIRECTORY_EDIT: string = "";

Image_temporal_edit :string="";
   


get_src_image(direc : string)
{
     /*FUNCION PARA ASIGNAR IMAGEN DESDE GALERIA*/
      this.IMAGE_DIRECTORY_SAVE=direc;
      
    /*Dish_image guarda el nombre de la imagen que se ha escogido desde la galería*/ 
    this.Dish_image=environment.API_URI+this.IMAGE_DIRECTORY_SAVE;
   
    /*ASIGNAMOS EL NOMBRE Y DIRECCION DE LA IMAGEN AL MODELO QUE USAMOS PARA EL PLATILLO*/
    this.dish_register.image =this.IMAGE_DIRECTORY_SAVE;
      
}


Photo_selected: ArrayBuffer| any;
   

limpiar_campos_imagen()
  {

    //dejamos la imagen por defecto par cuando no hay imagen seleccionada
    this.Photo_selected=environment.API_URI+"uploads/no_image.png";
   
  }

  reset_fileinput() 
{
  
// We will clear the value of the input 
// field using the reference variable.

  this.gallery_element.src_image= "";
  this.file=null;
}



gallery_element_mapeo: Gallery_element=
{
  id_gallery:0,
  src_image: ''
}



assign_image_category()
{
    /*FUNCION PARA ASIGNAR LA IMAGEN DE LA ULTIMA CATEGORÍA SELECCIONADA*/
    
   let cont=0;

  for (let i = 0; i < this.selected_list.length; i++)
  { 
    /**RECORREMOS EL ARRAY JSON PARA TOMAR EL ULTIMO VALOR QUE HAY EN LA LISTA DE CATEGORÍAS SELECCIONADAS 
     * unicamente lo metemos en el for para tomar el ultimo valor, pero pueden haber otras formas de hacerlo*/   
   
    if(this.selected_list[i].image!='uploads/no_image.png')
    {            
     // si hay un valor en this.selected_list[i].image; se obtiene la ultima imagen por medio del for
      this.Dish_image=environment.API_URI+this.selected_list[i].image;  
      /*ASIGNAMOS LA IMAGEN SELECIONADA DEL MODELO QUE ES LO QUE SE GUARDARÁ*/ 
      this.dish_register.image = this.selected_list[i].image;

      environment.Dish_image= this.selected_list[i].image;
      this.sharingservice.SharingObservableData =  {location : environment.API_URI+environment.Dish_image}

      cont++;
    } 
   }
    /**SI NO HAY NINGUN DATO EN EL JSON DE CATEGORÍAS ENTONCES SE LE ASIGNA LA IMAGEN NULA*/
    if(cont==0)
    {
      this.normal_alert('no_category');
    }      
   
}



normal_alert(elemento : String){
  
  if(elemento="no_category")
  {    

    Swal.fire({
      title: 'No hay ninguna imagen valida de categoria',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })

  }
}



    initFormParent(): void {
        this.formParent= new FormGroup({
          group_item_options: new FormArray([]),
          dinamicos: new FormArray([])
          
        })        

    }


   init_form_dish_return2(): FormGroup{
      return new FormGroup(        
        {            
          /**el campo signal unicamente es el encargado de obtener el valor del hijo seleccionado en el momento en que se elije ver el detalle de grupo
           * como el valor del hijo es global solo obtenemos su valor, así cuando se crea un nuevo hijo ese valor se conserva y registra el hijo o index
           * del grupo seleccionado, Global_child representa el valor del index del grupo seleccionado en el momento presionar el boton para ver el detalle
           * del grupo
           */
          signal: new FormControl(this.Global_child),
          tag: new FormControl('',[Validators.required]),
          price: new FormControl('',[Validators.required]),

        }        
      )
  }



   cont_ensay: boolean = true;
   hijo: string= "";

    init_form_dish_return(): FormGroup{
    

      return new FormGroup(
          {            
            name: new FormControl('',[Validators.required]),
            max_selected: new FormControl('1',[Validators.required]),
            /*VARIABLE PARA INDICAR SI HAY ELEMENTOS HIJOS PARE EL ELEMNTO PADRE, TANTO EL ELEMNTO PADRE COMO EL ELEMENTO HIJO SON SIMBOLICOS
             PUES LOS DOS FORMS SON HIJOS SOLO QUE POR LA ESTRUCTURA, UN ARRAY REPRESENTA A LOS GRUPOS Y EL OTRO A LOS ITEMS DE LOS GRUPOS 
            */
            has_sons: new FormControl(0),
            //order_value:new FormControl(this.Global_child)      
                
          }
          
        )
              
    }

    group_counter : number= 0;
    add_group_element(): void{
  
      this.group_counter=this.formParent.value.group_item_options.length;
      
      const refitems= this.formParent.get('group_item_options') as FormArray;
    
      refitems.push(this.init_form_dish_return()) 
 
    }

    add_item_element(): void{
      /**
       * SE LLAMA A ESTA FUNCION CADA VEZ QUE SE QUIERA CREAR OTRO OBJETO DE EXTRA O GUARNICION,
       * OSEA CADA VEZ QUE SE QUIERA AGREGAR UN ITEM EN CUALQUIERA DE LOS GRUPOS
       */
         
      const refitems= this.formParent.get('dinamicos') as FormArray;
            
      refitems.push(this.init_form_dish_return2())   
      this.verify_sons_items();  
      
      /**se llama al verificador de hijos del grupo para ver si hay hijos y mostrar o no 
       * la etiqueta "No hay ningun item en el grupo" OJO Global_child indica el index del grupo presente en el
       * modal por eso se envía como referencia
      */
      this.verify_sons_of_group(this.Global_child);

    }

    verify_sons_items(){

      /**
       * FUNCION QUE VERIFICA SI UN PADRE TIENE O NO TIENE HIJOS, SI NO TIENE MARCA EL CAMPO has_sons CON UN UNO PARA INDICAR QUE YA TIENE HIJOS.
       * ESTO LO HACE A LA HORA DE INSERTAR UN ITEM EN EL ARREGLO  dinamicos
       */
       this.cont_group_elements=0;
       
       
       
       /*
       CADA VEZ QUE SE ELIMINA UN ITEM O ELEMENTO DEL GRUPO SE REVISA SI TIENE O NO TIENE HIJOS EL PADRE, EN CASO DE QUE SEA CERO
       SE MARCA SIN HIJOS EL CAMPO has_sons DEL GRUPO Y POR LO TANTO VA A LANZAR EXCEPCION A AL HORA DE GUARDAR
       */


       for (let i = 0; i <this.formParent.value.dinamicos.length; i++)
       {
                if(this.formParent.value.dinamicos[i].signal == this.Global_child)
                {       
                 this.cont_group_elements++;                 
                }

       }

   
      
       if(this.cont_group_elements == 0)
       {        
       
         this.formParent.value.group_item_options[this.Global_child].has_sons = 0;
       }
 
       if(this.cont_group_elements > 0)
       {        
       
         this.formParent.value.group_item_options[this.Global_child].has_sons = 1;
       }
 
     // alert( this.formParent.value.group_item_options[this.Global_child].has_sons );
    }

    verify_index_items( index : number){

                /**
       * FUNCION QUE VERIFICA SI UN PADRE TIENE O NO TIENE HIJOS, SI NO TIENE MARCA EL CAMPO has_sons CON UN UNO PARA INDICAR QUE YA TIENE HIJOS.
       * ESTO LO HACE A LA HORA DE INSERTAR UN ITEM EN EL ARREGLO  dinamicos
       */
       this.cont_group_elements=0;
       /*
       CADA VEZ QUE SE ELIMINA UN ITEM O ELEMENTO DEL GRUPO SE REVISA SI TIENE O NO TIENE HIJOS EL PADRE, EN CASO DE QUE SEA CERO
       SE MARCA SIN HIJOS EL CAMPO has_sons DEL GRUPO Y POR LO TANTO VA A LANZAR EXCEPCION A AL HORA DE GUARDAR
       */
       for (let i = 0; i <this.formParent.value.dinamicos.length; i++)
       {
                if(this.formParent.value.dinamicos[i].signal == this.Global_child)
                {       
                 this.cont_group_elements++;
                 
                }
                
       }
      
       if(this.cont_group_elements == 0)
       {        
       
         this.formParent.value.group_item_options[this.Global_child].has_sons = 0;
       }
 
       if(this.cont_group_elements > 0)
       {        
       
         this.formParent.value.group_item_options[this.Global_child].has_sons = 1;
       }



    }

    
  getCtrl(key: string, form: FormGroup) : any
  {
    return form.get(key);    
  }

 
  getCtrl2(key: string, form: FormGroup) : any
  {
    return form.get(key);    
  }

  Edition_review(){
      
     this.formParent.value.group_item_options[this.Global_child].max_selected=this.group.max_selected;
     //this.formParent.value.group_item_options[this.Global_child].has_sons = 1;
      //this.verify_sons_items();
      //console.log(this.formParent);
      console.log(this.group.max_selected);
      //this.verify_sons_items();
  }



  Edit_dish(){    

    /**IGUALAMOS LA IMAGEN DE dish_register a la variable de entorno que contiene la imagen */
    this.dish_register.image=environment.Dish_image;

    if(this.formParent.valid == false)
    {
      alert("algo falla");
      console.log(this.formParent.value);
      this.error_validation_message_items();
      
    }


    if(this.dish_register.name === '' || this.dish_register.price === '' || this.dish_register.price === null || this.selected_list.length == 0)
    {
      
      this.error_validation_message_information();           
    }

              /**
       * FUNCION QUE VERIFICA SI UN PADRE TIENE O NO TIENE HIJOS, SI NO TIENE MARCA EL CAMPO has_sons CON UN UNO PARA INDICAR QUE YA TIENE HIJOS.
       * ESTO LO HACE A LA HORA DE INSERTAR UN ITEM EN EL ARREGLO  dinamicos
       */
               this.cont_group_elements=0;
               /*
               CADA VEZ QUE SE ELIMINA UN ITEM O ELEMENTO DEL GRUPO SE REVISA SI TIENE O NO TIENE HIJOS EL PADRE, EN CASO DE QUE SEA CERO
               SE MARCA SIN HIJOS EL CAMPO has_sons DEL GRUPO Y POR LO TANTO VA A LANZAR EXCEPCION A AL HORA DE GUARDAR
               */
               for (let i = 0; i <this.formParent.value.group_item_options.length; i++)
               {
                        if(this.formParent.value.group_item_options[i].has_sons == 0)
                        {       
                         this.cont_group_elements++;
                         
                        }
                        
               }

               if(this.cont_group_elements >  0)
               {
                 this.error_validation_message_items();
                 
               }   

    /**EN ESTE CASO EL PLATILLO TIENE EXTRAS Y POR ESO SE DEBE VALIDAR, PUES SI TIENE EXTRAS DEBE ESTAR COMPLETA LA VALIDACION CON EXTRAS */
    if(this.dish_register.name !== '' && this.dish_register.price !== '' && this.dish_register.name !== null && this.dish_register.price !== null 
    && this.formParent.valid == true && this.cont_group_elements == 0 && this.selected_list.length > 0)  {
       
      /*IGUALAMOS EL CAMPO selected_list DEL MODELO dish_register AL CAMPO selected_list
       que es el array que contiene las categorías que se han seleccionado 
        */ 
      this.dish_register.selected_list=this.selected_list;

      this.dish_register.group_list=this.formParent.value.group_item_options;
      this.dish_register.sons_list = this.formParent.value.dinamicos;
      

      
      //if(this.dish_register_temporal.description == this.dish_register)

       this.static_fields_function();
       this.group_list_function();
       this.sons_list_function();
       this.selected_list_function();

       
      
      if(this.dish_register.static_fields_var == false || this.dish_register.group_list_var == false || this.dish_register.sons_list_var == false || this.dish_register.selected_list_var == false)
      {
        //alert("No es igual");
        this.edit_dish(this.dish_register);
      }
      
         
        
    }
    
    /**SI EL PLATILLO NO TIENE EXTRAS ENTONCES NO SE VALIDAN LOS CAMPOS DE LOS EXTRAS, EN ESTE CASO LOS HIJOS group_item_options y dinamicos NO TIENEN NINGUN VALOR POR LO TANTO NO HAY EXTRAS*/
    if(this.dish_register.name !== '' && this.dish_register.price !== '' && this.dish_register.name !== null && this.dish_register.price !== null 
    && this.formParent.value.group_item_options.length == 0 && this.formParent.value.dinamicos.length == 0 && this.selected_list.length > 0) {
       
      /*IGUALAMOS EL CAMPO selected_list DEL MODELO dish_register AL CAMPO selectedOptions */ 
      this.dish_register.selected_list=this.selectedOptions;
      this.dish_register.group_list=this.formParent.value.group_item_options;
      this.dish_register.sons_list = this.formParent.value.dinamicos;
        
    }

    this.dish_register.group_list=this.formParent.value.group_item_options;

    
  }

   
  error_validation_message_information()
  {
    Swal.fire({
      icon: 'error',
      title: 'Complete la informacion del platillo',
      text: 'El nombre, categoría y precio del platillo son requeridos!',
      footer: '<a >Verifique los campos de informacion </a>'
    })            

  }
  
  error_validation_message_items()
  {
    Swal.fire({
      icon: 'error',
      title: 'Complete los campos...',
      text: 'Existen campos vacíos en los grupos!',
      footer: '<a >Verifique los campos en rojo</a>'
    })            

  }

  error_incomplete_groupitems()
  {
    Swal.fire({
      icon: 'error',
      title: 'Por favor...',
      text: 'Ingrese una descripcion y un numero maximo seleccionable!',
      footer: '<a >Complete los campos que se le piden</a>'
    })            

  } 

     remove_group(index : number){
  
      
      /**PARA ELIMINAR UN GRUPO, RECIBIMOS EL INDEX DEL GRUPO Y ESE ES EL QUE SE ELIMINA MEDIANTE LA FUNCION removeAt */
      
         const control = <FormArray>this.formParent.controls['group_item_options'];
         control.removeAt(index);

         

        
        /**LUEGO DE ELIMINAR EL ITEM DEL GRUPO QUE COINCIDE CON EL INDEX, PROCEDEMOS MARCAR CON -1 LOS ITEMS DEL ARRAY DINAMICOS QUE PERTENCEN 
         * AL ITEM DEL GRUPO ELIMINADO, ESTOS ESTAN MARCADOS EN EL CAMPO signal CON EL MISMO VALOR DEL INDEX DEL GRUPO ELIMINADO,
         * EL RECORRIDO DEBE SER DESCENDENTE YA QUE EL TAMAÑO DEL ARRAY ESTA EN CONSTANTE CAMBIO, SI SE ELIMINA UNA POSICION DE EL ARRAY
         * ESTE TIENE UNA POSICION MENOS, ASÍ QUE EL RECORRIDO DESCENDENTE PERMITE QUE EL TAMAÑO DEL ARREGLO NO INTERFIERA CON EL ALGORITMO
         * 
          */
         
         for (let i = 0; i < this.formParent.value.dinamicos.length; i++)
         {

             
                if(this.formParent.value.dinamicos[i].signal == index)
                {
                
                  this.formParent.value.dinamicos[i].signal = -1;
                                         
                }     
     
         } 

         const control2 = <FormArray>this.formParent.controls['dinamicos'];
        

         for (let i = 0; i < this.formParent.value.dinamicos.length; i++)
         {
   
                if(this.formParent.value.dinamicos[i].signal == -1)
                {
               
                  control2.removeAt(i);
                                         
                }     
     
         } 
          

         
            
       for (let i = 1; i < this.formParent.value.dinamicos.length; i++)
        {

     
               if(this.formParent.value.dinamicos[i].signal >= index )
               {

               this.formParent.value.dinamicos[i].signal = this.formParent.value.dinamicos[i].signal-1;                              
               }     
    
        } 
     
     }



  


     cont_group_elements = 0;
     
   
     

     remove_group_element(index : number){

      /**PARA ELIMINAR EL ELEMENTO DE UN GRUPO, UNICAMENTE ELIMINA UN ELEMENTO */
      const control = <FormArray>this.formParent.controls['dinamicos'];
      control.removeAt(index);
      this.verify_sons_items();

      /**se llama al verificador de hijos del grupo para ver si hay hijos y mostrar o no 
       * la etiqueta "No hay ningun item en el grupo" OJO Global_child indica el index del grupo presente en el
       * modal por eso se envía como referencia
      */
       this.verify_sons_of_group(this.Global_child);
  }


  
    Global_child : number = 0;
    //Global_order_value: number=0;

    group_value_name : string='';
    group_value_maxselected : string='';

     Items_indicator : number = 0;

     groupitems_indicator : number = 0;
     Present_Child(formChild : number){
     
      if(this.formParent.value.group_item_options[formChild].name == "" || this.formParent.value.group_item_options[formChild].max_selected == ""
        || this.formParent.value.group_item_options[formChild].name == null || this.formParent.value.group_item_options[formChild].max_selected == null)
        {
          this.groupitems_indicator = 0;  
          this.error_incomplete_groupitems()
        }

     
        if(this.formParent.value.group_item_options[formChild].name != "" && this.formParent.value.group_item_options[formChild].max_selected != ""
        && this.formParent.value.group_item_options[formChild].name != null && this.formParent.value.group_item_options[formChild].max_selected != null)
        {  
          this.groupitems_indicator = 1;
         this.Global_child=formChild;
  
         /*ESTA FUNCION UNICAMENTE ASIGNA EL INDEX DEL GRUPO DEL QUE SE QUIERE VER EL DETALLE, SI SE SELECCIONA VER EL DETALLE DEL GRUPO 2 POR EJEMPLO,
         AL LLAMAR A ESTA FUNCION EL INDEX PERMANECERÁ EN VALOR 2 TODO EL TIEMPO QUE EL USUARIO ESTE EN EL DETALLE, ESO INCLUYE VER DETALLE (LEER), AGREGAR 
         ELEMENTO AL DETALLE, INCLUSO MODIFICAR Y ELIMINAR */

         this.group.name=this.formParent.value.group_item_options[formChild].name;
         this.group.max_selected=this.formParent.value.group_item_options[formChild].max_selected;
      
         this.verify_sons_of_group(formChild);
       }
     }

     verify_sons_of_group(formChild : number){
        /**FUNCION QUE VERIFICA SI UN GRUPO TIENE ELEMENTOS O ITEMS, SIRVE EN EL MODAL PARA EDITAR 
         * UNICAMENTE PARA INDICAR SI UN GRUO TIENE ITEMS O NO POR ESO SE TIENE QUE VERIFICAR AL ABRIRSE
         * EL MODAL DE EDICION Y AL CREAR UN NUEVO ELEMENTO
         */
         if(this.formParent.value.group_item_options[formChild].has_sons == 1)
         {
             this.Items_indicator = 1;    
         }
 
         else if(this.formParent.value.group_item_options[formChild].has_sons == 0)
         {
             this.Items_indicator = 0;    
         }
       
     }



     Present_Child_reverse(){
      
      /*ESTA FUNCION UNICAMENTE ASIGNA EL INDEX DEL GRUPO DEL QUE SE QUIERE VER EL DETALLE, SI SE SELECCIONA VER EL DETALLE DEL GRUPO 2 POR EJEMPLO,
      AL LLAMAR A ESTA FUNCION EL INDEX PERMANECERÁ EN VALOR 2 TODO EL TIEMPO QUE EL USUARIO ESTE EN EL DETALLE, ESO INCLUYE VER DETALLE (LEER), AGREGAR 
      ELEMENTO AL DETALLE, INCLUSO MODIFICAR Y ELIMINAR */
      

      this.formParent.value.group_item_options[this.Global_child].name=this.group.name;
      this.formParent.value.group_item_options[this.Global_child].max_selected=this.group.max_selected;


     }

     

     /*saving_dish(dish : Dish_register)
    {
         
         
         this.dishService.saving_dish(dish)
       .subscribe(
          res =>{
            
            
            this.Save_dish_alert();
            
            /**LIMPIAMOS TODOS LOS CAMPOS DE NUEVO PARA DEJARLO LISTO Y ASÍ VOLVER A GUARDAR OTRO PLATILLO */
           /* this.formParent= new FormGroup({
              group_item_options: new FormArray([]),
              dinamicos: new FormArray([])              
            })           

            this.selectedOptions = [];                   
            this.dish_register.name='';
            this.dish_register.description='';
            this.dish_register.price='';
            this.dish_register.selected_list=[];
            this.dish_register.group_list=[];
            this.dish_register.sons_list=[];          
            /**EN EL CASO DE Dish_image solo le dejamos la imagen por defecto para indicar que no hay imagen */
            /*this.Dish_image='assets/img/no_image.png'; 
          },
          err => console.log(err)
         
       )
  
      
    }*/

    edit_dish(dish_register : Dish_register){
          
      this.loading_button_edit = true;
      this.dishService.edit_dish(this.dish_register).subscribe(
        res =>{
           //console.log("Respuesta de transaccion "+res);
          this.loading_button_edit = false;
          this.Save_changes_alert(res);
        },
        err => console.log(err)
       
     )

    }



    Save_changes_alert(res : JSON | any)
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
    title: 'Platillo editado'
  })
}

   


       static_fields_function(){
         if(
          this.dish_register.name == this.dish_register_temporal.name
          && this.dish_register.price == this.dish_register_temporal.price                          
          && this.dish_register.description == this.dish_register_temporal.description
          && this.dish_register.image == this.dish_register_temporal.image 
          && this.dish_register.is_enable == this.dish_register_temporal.is_enable 
          
          )
          {
            this.dish_register.static_fields_var = true;
          }
          
            else
            this.dish_register.static_fields_var = false;
      }

       
        group_list_function(){
          if(JSON.stringify(this.dish_register.group_list) === JSON.stringify(this.dish_register_temporal.group_list))
          {   
                           this.dish_register.group_list_var = true;
          }        
          
          else
          {
            this.dish_register.group_list_var = false;
          
          }
        }

        sons_list_function(){
          if(JSON.stringify(this.dish_register.sons_list) === JSON.stringify(this.dish_register_temporal.sons_list))
          {    
            this.dish_register.sons_list_var = true;
          }        
          
          else
          {
            this.dish_register.sons_list_var = false;
          
          }
        }

        selected_list_function(){
          if(JSON.stringify(this.selected_list) === JSON.stringify(this.dish_register_temporal.selected_list))
          {    
            this.dish_register.selected_list_var = true;
          }        
          
          else
          {
            this.dish_register.selected_list_var = false;
          
          }
        }

        
      /**REGISTRA EL EVENTO QUE SE GENERA AL DARLE CLICK A LA HORA DE SELECCIONAR CUALQUIER CHECK BOX */
      
  onNgModelChange2(){
    /*IGUALAMOS selected_list PORQUE selectedOptions tiene el listado de datos que han sido seleccionados, el valor de selectedOptions      
    */
    
    if(this.dish_register.button_enable ==true)
    {
       this.dish_register.button_enable = false;
       this.dish_register.is_enable=0;
       
    }
    
    
    else if(this.dish_register.button_enable == false)
    {
       this.dish_register.button_enable =true;
       this.dish_register.is_enable=1;
    }

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
