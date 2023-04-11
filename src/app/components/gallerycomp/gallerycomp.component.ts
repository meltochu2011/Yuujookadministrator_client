import { Component, OnInit } from '@angular/core';
import { Dish_register } from 'src/app/models/Dish_register';
import { Gallery_element } from 'src/app/models/Gallery_element';
import { DishService } from 'src/app/services/dish.service';
import { environment } from 'src/environments/environment';
//import { DishFormComponent } from '../dish-form/dish-form.component';
import Swal from 'sweetalert2';
import {SharingService,Component_dat} from '../../services/sharing.service';
import { DishFormComponent } from '../dish-form/dish-form.component';
import { Observable } from 'rxjs';
import { ReadVarExpr } from '@angular/compiler';

@Component({
  selector: 'app-gallerycomp',
  templateUrl: './gallerycomp.component.html',
  styleUrls: ['./gallerycomp.component.css']
})
export class GallerycompComponent implements OnInit {

  data$: Observable <Component_dat>;

  constructor(private dishService: DishService, private sharingservice : SharingService) { 
    this.data$= sharingservice.SharingObservable;
    this.getimages_quantity();
    this.getGallery(this.global_image_index_page);
    
  }

  ngOnInit(): void {
  
  }


  public file: any| File;
  public loading : any|boolean;
  Photo_selected: ArrayBuffer| any;
   
  global_images_quantity=0;

  global_image_index_page=0;
  Gallery_limit : number = 80;

  uploadPhotogallery(){
    /*FUNCION PARA SUBIR UNA IMAGEN A LA GALERÍA*/            

    if(this.Total_images >= this.Gallery_limit)
      {
    //this.Total_images = this.Total_images+1;  
    Swal.fire({
      icon: 'error',
      title: 'Limite de galería',
      text: 'Se ha llegado al limite en la galleria!',
      footer: '<a >El limite son 80 imagenes</a>'
    })            

     }
      /*if(this.Total_images > this.Gallery_limit)
      {
           alert("Se ha rebasado el limite");
           this.Total_images= this.Total_images - 1;
      }*/
    

     /**PASAMOS el global_image_index_page en valor 0, DE ESE MODO MUESTRA LA PRIMERA
      * PAGINACION Y EL ULTIMO ELEMENTO 
       */
     if((this.file!=null || this.file!='') && this.Total_images < this.Gallery_limit)
    {
    
       /**PONER EL CURSOR EN MODO ESPERA */
     document.body.style.cursor = 'wait';
      
     this.loading=false;
     this.loading=true;  
    
     this.dishService.saveGalleryelement(this.file)
     .subscribe(      
       res =>{
        
         this.getimages_quantity();
         this.getGallery(0);
         this.reset_fileinput(); 
         
         
         /**la variable para seleccionar imagen vuelve a estar en estado null, de este modo se desactiva
             * de nuevo el boton subir imagen hasta que de nuevo se seleccione un archivo de imagen,
             * recordemos que esta variable es de tipo buffer array
             */
          this.Photo_selected=null;
          /**Poner el cursor en modo normal (default) */
          this.loading=false;
          document.body.style.cursor = 'default';
          
       },

         err => this.error_inserting(err)
         
       //err => console.log(err)
       )
         
      /* this.loading=false;  
     }, 1500 );*/
 
    }
}


gallery_element: Gallery_element=
    {
      id_gallery:0,
      src_image: '',
      useful: 0
    }

reset_fileinput() 
{

  this.gallery_element.src_image= "";
  this.file=null;
  this.gallery_element.useful= 0;
  
}



gallery: any =[];

getGallery(index_begining: number)
  {
    /**CAMBIAMOS LA FORMA DEL CURSOR A ESPERA*/
    document.body.style.cursor = 'wait';
    /*OBTENEMOS LAS DIRECCIONES DE LAS IMAGENES QUE SE HAN ALMACENADO EN LA TABLA GALLERY
    PARA LUEGO PROCEDER A MOSTRARLAS*/ 
                 
    this.global_image_index_page=index_begining;
 
    
    this.dishService.getGallery(""+index_begining).subscribe(
      res=> {

        this.gallery=res;
         /**CAMBIAMOS LA FORMA DEL CURSOR A DEFAULT */
        document.body.style.cursor = 'default';
      },
      err=> console.error(err)
    );
  }     

  IMAGE_DIRECTORY_SAVE: string = "";
  
  API_URI: ArrayBuffer| string=environment.API_URI;


get_src_image(direc : string)
{
    /**MANDAMOS LA DIRECCION COMPLETA, YA QUE SOLO ASÍ LO ACEPTÓ EN LA VISTA */    
    this.sharingservice.SharingObservableData =  {location : environment.API_URI+direc} 
    /** GUARDAMOS EL DIRECTORIO DE IMAGEN PORQUE ESTE VALOR SERA EL QUE SE GUARDARÁ*/
    environment.Dish_image=direc;
    
}



/**variable para introducir los numeros de la paginacion en un array, a diferencia de la paginacion de 10
 * elementos, esta se hace con una variable cuyo valor es de 20
 */
 elements_per_page=20;
 global_sumatory=0;
 array_images_count: any =[];
 imagespaging_array: any =[];

 Total_images : number = 0;

getimages_quantity(){

  /**PAGINACION QUE SE LLEVA A CABO CUANDO SE ARRANCA EL PROGRAMA, POR ESO TIENE QUE REALIZAR UNA CONSULTA 
   * PARA VER CUANTAS IMAGENES EXISTEN
  */
  //this.global_images_quantity=0;
   //this.array_images_count=0;
  this.imagespaging_array=[];
  this.array_images_count=[];
this.dishService.getimagesquantity().subscribe(
  res=> {

     
    this.array_images_count=res;     
    this.Total_images =this.array_images_count[0].count;
    //**--------__________________________ */
    let suma_constante=0;
    let residuo=this.array_images_count[0].count; 
      
      /** SUMA CONSTANTE TENDRA EL VALOR DE 0*/
      this.imagespaging_array.push({"init" : suma_constante} );

      while(residuo > 0)
      {
          /** RESIDUO INICIALMENTE TIENE LA MISMA MAGNITUD QUE LA CANTIDAD DE CATEGORÍAS, LUEGO SE VA RESTANDO POCO A POCO
           * HASTA LLEGAR A 0, ESO CON EL FIN DE DETERMINAR EL NUMERO DE PAGINAS (programacion recursiva)*/   
          if(residuo > 20 )
          {
            /**SI residuo es mayor que 10 quiere decir que hay mas de 10 y por lo tanto se va llenando un array con la
             * variable "suma_constante" que va aumentando de 10 en 10, la primera vez que lo hace tiene un valor de 10, luego,
             * si residuo sigue siendo mayor que 10 "suma_constante" vale 20, a la siguiente 30 y así sucesivamente.
            */
             suma_constante=suma_constante+20;
             this.global_sumatory=suma_constante;
           
             this.imagespaging_array.push({"init" : suma_constante} );
             residuo=residuo-20;              
          }

          else if(residuo-20 == 0 || residuo-20 < 20 )
          {/**SI EL RESIDUO ES IGUAL A 10 O MENOR QUE 10 YA NO ES NECESARIO AGREGAR UNA NUEVA PAGINA, PUES CON 
          EL VALOR INICIAL QUE SE AGREGA AL INICIO DE LA FUNCION ES SUFICIENTE PARA CUBRIR VALORES QUE VAN DE 1 A 10,
           UNICAMENTE ES NECESARIO IGUALAR EL RESIDUO A CERO Y ASÍ SE DETENGA EL CICLO  */
            residuo=0;             
          }




          
          this.getGallery(this.global_image_index_page);

      }
     /**____________________________________________ */


      
  },
  err=> console.error(err)
);

}


capturarFile(event : any): void {
     
  if (event.target.files && event.target.files[0])
  {
      this.file= <File> event.target.files[0];  
       
      const reader = new FileReader();
      reader.onload= e => this.Photo_selected = reader.result;
      reader.readAsDataURL(this.file);
      
  }
     

}

gallery_element_mapeo: Gallery_element=
{
  id_gallery:0,
  src_image: '',
  useful: 0
}
map_gallery_element(element: Gallery_element)
{
   /*Recibe la estructura de categoría a traves de parametro y se lo asigna a la estructura categoty_ins para su 
   utilizacion en el frontend
   */    
 
this.gallery_element_mapeo.id_gallery=element.id_gallery;
this.gallery_element_mapeo.src_image=element.src_image;  
this.gallery_element_mapeo.useful = element.useful;

this.alerta_confirmacion();

}

error_inserting(res : String )
{
  Swal.fire({
    icon: 'error',
    title: 'Falla al guardar',
    text: 'Verifique: '+res,
    footer: '<a >Notifique la falla</a>'
  })            
}


alerta_confirmacion()  {
  Swal.fire({
    title: 'Está seguro?',
    text: "De borrar esta imagen!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminar imagen!',
    cancelButtonText:'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteGalleryelement();
    }
  })
  

}

clear_image_field(){

   this.file=null;
   this.Photo_selected=null;
   this.reset_fileinput(); 
  
}

deleteGalleryelement(){

  /**Elimina el elemento en base al id que hay en gallery_element.id, ya que este campo tiene el id
   * de la imagen seleccionada a partir del mapeo que se hace antes de llamar a esta función.
   */
 
/**CAMBIAMOS LA FORMA DEL CURSOR A ESPERA*/
document.body.style.cursor = 'wait';
 this.dishService.deleteGalleryElement  (this.gallery_element_mapeo).subscribe(
  res=> {
    /**CAMBIAMOS LA FORMA DEL CURSOR A MODO DEFECTO*/  
   document.body.style.cursor = 'default';

    /*ACA ANTEPONEMOS EL EFECTO DEL CURSOR PORQUE getGallery TAMBIEN TIENE
    EFECTO DE CURSOR*/
    this.getimages_quantity();
    this.getGallery(this.global_image_index_page);    
    
    Swal.fire(        
      'Elemento Eliminado!',
      ''+res
    )
  },
  err=> console.error(err)
  
 
 )
 
}


/*limpiar_campos_imagen()
{

  //dejamos la imagen por defecto par cuando no hay imagen seleccionada
  this.Photo_selected=environment.API_URI+'uploads/no_image.png';
 
}*/


}
