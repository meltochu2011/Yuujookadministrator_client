import { Component, HostBinding, OnInit,NgModule } from '@angular/core';
import { Dish } from 'src/app/models/Dish';
import { Category_ins } from 'src/app/models/Category_ins';

import { Group } from 'src/app/models/Group';

import {DishService} from '../../services/dish.service';
import {SharingService,Component_dat} from '../../services/sharing.service';

import { ActivatedRoute, Router} from '@angular/router';
import { Gallery_element} from 'src/app/models/Gallery_element';
import { Adds} from 'src/app/models/Adds';
import Swal from 'sweetalert2';
import {FormGroup,FormControl,FormArray,Validators, FormBuilder} from '@angular/forms';
import { Dish_register } from 'src/app/models/Dish_register';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {WebSocketService} from '../../services/web-socket.service';



@Component({
  selector: 'app-dish-form',
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css']
})



export class DishFormComponent implements OnInit {

   data$: Observable <Component_dat>;
 
  constructor(private dishService: DishService, private router: Router, private activedRoute: ActivatedRoute,private fb : FormBuilder,private sharingservice : SharingService, private websocketservice : WebSocketService) {
    
    this.Socket_config();
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
  
   }
   
   
   public formParent: FormGroup = new FormGroup({});

  ngOnInit () {
 
   this.initFormParent();
   //LLAMA
   this.getcategories_quantity_initial();
   this.getCategories();
   
  }



  /*dish: Dish =
    {
      id:0,
      title:'',
      description:'',
      image:''
    };*/

    dish_register: Dish_register =
    {
      id_product:0,
      name: '',
      description : '',
      price: '',
      selected_list: [], /*PARA LA LISTA DE CAGEGORÍAS SELECCIONADAs*/
      group_list : [],
      sons_list : [],
      
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


    category: any =[];
    selectedOptions =[];

    selected_list:any =[];
    
    add_item_array:any =[];
    
    API_URI: ArrayBuffer| string=environment.API_URI;

   
    public file: any| File;
  

  loading_gif: boolean= false;
  getCategories()
  {
    document.body.style.cursor = 'wait';
    this.dishService.getCategories().subscribe(
      res=> {

        this.category=res;
        
    /**CAMBIAMOS LA FORMA DEL CURSOR A ESPERA*/
    document.body.style.cursor = 'default';
    this.loading_gif=false; 
      },
      err=> console.error(err)
    );

  }

  
  public loading : any|boolean;

  global_index_page=0;
  global_quantity=0;
  global_sumatory=0;
  paging_array: any =[];
  array_category_count: any =[];


  pagination_value=8;
  
  getcategories_quantity_initial(){
    /**PAGINACION QUE SE LLEVA A CABO CUANDO SE ARRANCA EL PROGRAMA POR ESO TIENE QUE REALIZAR UNA CONSULTA 
     * PARA VER CUANTAS CAGEGORÍAS EXISTEN
    */
  this.dishService.getcategoriesquantity().subscribe(
    res=> {

      this.array_category_count=res;     
    

    
      let suma_constante=0;
      let residuo=this.array_category_count[0].count; 
      /**LA VARIABLE global_quantity ES PARA RECORDAR EL CONTEO INICIAL QUE SE HIZO AL INICIO EN EL CONSTRUCTOR 
       * YA QUE DESPUES SIRVE EN OTRAS FUNCIONES
      */
      this.global_quantity=this.array_category_count[0].count;
     
      
      /** SUMA CONSTANTE TENDRA EL VALOR DE 0*/
      this.paging_array.push({"init" : suma_constante} );

      while(residuo > 0)
      {
          /** RESIDUO INICIALMENTE TIENE LA MISMA MAGNITUD QUE LA CANTIDAD DE CATEGORÍAS, LUEGO SE VA RESTANDO POCO A POCO
           * HASTA LLEGAR A 0, ESO CON EL FIN DE DETERMINAR EL NUMERO DE PAGINAS (programacion recursiva)*/   
          if(residuo-this.pagination_value > this.pagination_value )
          {
            /**SI residuo -10 es mayor que 10 quiere decir que hay mas de 10 y por lo tanto se va llenando un array con la
             * variable "suma_constante" que va aumentando de 10 en 10, la primera vez que lo hace tiene un valor de 10, luego,
             * si residuo sigue siendo mayor que 10 "suma_constante" vale 20, a la siguiente 30 y así sucesivamente.
            */
             suma_constante=suma_constante+this.pagination_value;
             this.global_sumatory=suma_constante;
           
             this.paging_array.push({"init" : suma_constante} );
             residuo=residuo-this.pagination_value;  
             
          }

         if(residuo-this.pagination_value < this.pagination_value )
          {
            /**si residuo es menor que 10 significa que todavía quedan de 1 a 9 y por lo tanto hay que agregar otra paginacion,
             * por lo tanto se agrega un valor mas de "suma_constante" al array, otro valor multiplo de 10 que es la suma que se
             * viene ejecutando */               
            suma_constante=suma_constante+this.pagination_value;
            this.global_sumatory=suma_constante;
            this.paging_array.push({"init" : suma_constante} );
            
             residuo= residuo-residuo;             
          }
          
          if(residuo-this.pagination_value == this.pagination_value )
          {/**SI EL RESIDUO MENOS 10 ES IGUAL A 10 YA NO ES NECESARIO AGREGAR UNA NUEVA PAGINA, PUES CON LAS COMPARACIONES
          ANTERIORES SE DEJA PREPARADA LA PAGINACION , UNICAMENTE ES NECESARIO RESTARLE LOS 10 PARA QUE PASE A CERO Y SE DETENGA
          EL CICLO  */
            residuo=residuo-this.pagination_value;             
          }
         
          console.log(this.paging_array);
      }

    },
    err=> console.error(err)
  );

}


   
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


/** VARIABLE PARA CUANDO SE SELECCIONA LA IMAGEN DESDE LA VENTANA PRINCIPAL */
Dish_image :string ="";

IMAGE_DIRECTORY_EDIT: string = "";

Image_temporal_edit :string="";
   
  reset_data_fields() 
{
    /**LIMPIAMOS TODOS LOS CAMPOS DE NUEVO PARA DEJARLO LISTO Y ASÍ VOLVER A GUARDAR OTRO PLATILLO */
    this.formParent= new FormGroup({
      group_item_options: new FormArray([]),
      dinamicos: new FormArray([])              
    })           

    this.selectedOptions = [];                   
    this.dish_register.name='';
    this.dish_register.description='';
    this.dish_register.price='';
    this.selected_list=[];
    this.dish_register.selected_list=[];
    this.dish_register.group_list=[];
    this.dish_register.sons_list=[];          
    /**EN EL CASO DE Dish_image solo le dejamos la imagen por defecto para indicar que no hay imagen */
    this.Dish_image='/assets/img/no_image.png'; 

    this.file=null;
    this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"}; 
 
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

assign_no_image(){  
  
  environment.Dish_image= 'uploads/no_image.png';
  /*ASIGNAMOS LA IMAGEN SELECIONADA DEL MODELO QUE ES LO QUE SE GUARDARÁ, el observable no se guarda
   unicamente sirve para mostrar*/
  this.dish_register.image=environment.Dish_image;
   
  /**CAMBIAMOS EL VALOR DEL OBSERVABLE PARA QUE TAMBIEN ACTUALICE SU VALOR DE IMAGEN
   */
  
  this.sharingservice.SharingObservableData =  {location : "/assets/img/no_image.png"}  
  this.dish_register.has_image=0;   
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


   init_form_dish_return_child(): FormGroup{
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
    
        let maxim_value=0;
        for (let i = 0; i <this.formParent.value.group_item_options.length; i++)
        {
                 if(this.formParent.value.group_item_options[i].order_value > maxim_value)
                 {       
                      maxim_value=this.formParent.value.group_item_options[i].order_value;                 
                 }
 
        }


        /*console.log(this.formParent.value.group_item_options);*/

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



    add_group_element(): void{

        
     
      const refitems= this.formParent.get('group_item_options') as FormArray;
    
      refitems.push(this.init_form_dish_return()) 
     
    }

    add_item_element(): void{
      /**
       * SE LLAMA A ESTA FUNCION CADA VEZ QUE SE QUIERA CREAR OTRO OBJETO DE EXTRA O GUARNICION,
       * OSEA CADA VEZ QUE SE QUIERA AGREGAR UN ITEM EN CUALQUIERA DE LOS GRUPOS
       */
         
      const refitems= this.formParent.get('dinamicos') as FormArray;
            
      refitems.push(this.init_form_dish_return_child())   
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

       console.log("tiene hijos ? ", this.cont_group_elements);
      
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
       console.log(this.cont_group_elements);
      
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


  varia : BehaviorSubject<Component_dat> | any;

  Save_newdish(){    

    console.log(this.formParent);
 
    /**ASIGNAMOS LA IMAGEN ACTUAL EN LA VARIABLE DE ENTORNO DE IMAGEN */
    this.dish_register.image = environment.Dish_image;
  
    //console.log(this.dish_register.image);

    if(this.formParent.valid == false)
    {
      console.log("form parent es falso");
      this.error_validation_message_items();
      
    }


    if(this.dish_register.name === '' || this.dish_register.price === '' || this.dish_register.price === null )
    {
      console.log("datos estan incompletos");
  
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
    if(this.dish_register.name !== '' && this.dish_register.price !== '' && this.dish_register.name !== null && this.dish_register.price !== null && this.formParent.valid == true && this.cont_group_elements == 0 && this.formParent.value.group_item_options.length > 0 && this.formParent.value.dinamicos.length > 0)  {
       
      /*IGUALAMOS EL CAMPO selected_list DEL MODELO dish_register AL CAMPO selected_list */ 
      this.dish_register.selected_list=this.selected_list;
      this.dish_register.group_list=this.formParent.value.group_item_options;
      this.dish_register.sons_list = this.formParent.value.dinamicos;
      
      console.log(this.dish_register.sons_list.signal);
      this.saving_dish(this.dish_register);

    }
    
    /**SI EL PLATILLO NO TIENE EXTRAS ENTONCES NO SE VALIDAN LOS CAMPOS DE LOS EXTRAS, EN ESTE CASO LOS HIJOS group_item_options y dinamicos NO TIENEN NINGUN VALOR POR LO TANTO NO HAY EXTRAS*/
    if(this.dish_register.name !== '' && this.dish_register.price !== '' && this.dish_register.name !== null && this.dish_register.price !== null && this.formParent.value.group_item_options.length == 0 && this.formParent.value.dinamicos.length == 0 ) {
       
      /*IGUALAMOS EL CAMPO selected_list DEL MODELO dish_register AL CAMPO selectedOptions */ 
      this.dish_register.selected_list=this.selectedOptions;
      this.dish_register.group_list=this.formParent.value.group_item_options;
      this.dish_register.sons_list = this.formParent.value.dinamicos;
      console.log(this.dish_register.sons_list.signal);
      this.saving_dish(this.dish_register);
    }

    this.dish_register.group_list=this.formParent.value.group_item_options;

    
  }

   
  error_validation_message_information()
  {
    Swal.fire({
      icon: 'error',
      title: 'Complete la informacion del platillo',
      text: 'El nombre y precio del platillo son requeridos!',
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
      console.log(index);
      
      
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
     

         console.log(this.formParent.value.dinamicos);
        
     }


     cont_group_elements = 0;
     
     remove_group_element(index : number){

      /**PARA ELIMINAR EL ELEMENTO DE UN GRUPO, UNICAMENTE ELIMINA UN ELEMENTO */
      const control = <FormArray>this.formParent.controls['dinamicos'];
      control.removeAt(index);
      this.verify_sons_items();
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
      
      this.formParent.value.group_item_options[this.Global_child].name=this.group.name
      this.formParent.value.group_item_options[this.Global_child].max_selected=this.group.max_selected;
      
     }


     saving_dish(dish : Dish_register)
    {
         if(this.dish_register.image != 'uploads/no_image.png')
         {
             this.dish_register.has_image=1;  
         }

         if(this.dish_register.image == 'uploads/no_image.png')
         {
             this.dish_register.has_image=0;  
         }     

            /**PONER EL CURSOR EN MODO ESPERA */
          document.body.style.cursor = 'wait';
          this.loading= true;

         this.dishService.saving_dish(dish)
       .subscribe(
          res =>{
            
            
            this.Save_dish_alert();
            this.reset_data_fields(); 
            /**PNER EL CURSOR POR DEFECTO */
            document.body.style.cursor = 'default';
            this.loading= false;

          },
          err => console.log(err)
         
       )
  
      
    }


    Save_dish_alert()
     {
       Swal.fire(
       '¡Platillo agregado!',
       'satisfactoriamente!',
       'success'
                )
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


