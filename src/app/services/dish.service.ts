import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from '../models/Category'
import { Dish_register } from '../models/Dish_register';
import { Gallery_element } from '../models/Gallery_element';
import {environment} from 'src/environments/environment';
import { Userload } from '../models/Userload';
import { JsonwtService } from './jsonwt.service';




@Injectable({
  providedIn: 'root'
})
export class DishService {

  
  constructor(private http: HttpClient,private jwservice : JsonwtService) { }

  /*yuujook*/

getCategories(){
  /**SIRVEN PARA MOSTRAR EL MODAL DE CATEGORÍAS A LAS QUE VA A PERTENECER UN PRODUCTO
   * A LA HORA DE CREAR UN NUEVO PLATILLO
*/
const token = this.jwservice.TokenObservable;   
const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);

  return this.http.get(environment.API_URI+'categories', {headers: headers});
} 


 
getSelected_categories(id_product: number){
/** OBTENER CATEGORÍAS A LAS QUE PERTENECE UN PRODUCTO ESPECÍFICO */
const token = this.jwservice.TokenObservable;   
const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);
  return this.http.get(environment.API_URI+'specific_product_categories/'+id_product, {headers: headers});
}


/**OBTENER CATEGORÍAS, CON EL PARAMETRO cat_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getCategories_pagecount(cat_count : string){
   const token = this.jwservice.TokenObservable;
   
   const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
  return this.http.get(environment.API_URI+'categories_pagecount/'+cat_count, {headers: headers});
}

/**OBTENER CATEGORÍAS, CON EL PARAMETRO cat_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getGallery(image_count :string){
  const token = this.jwservice.TokenObservable;
   
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
 
  return this.http.get(environment.API_URI+'getgallery/'+image_count, {headers: headers});
}

/**OBTENER PRODUCTOS, CON EL PARAMETRO prod_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getProducts(prod_count :string){
  const token = this.jwservice.TokenObservable; 
   const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)  
  return this.http.get(environment.API_URI+'getproducts/'+prod_count, {headers: headers});
}

/**OBTENER PRODUCTOS, CON EL PARAMETRO prod_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getProducts_byfilter( category_id :string, counter : string){

  const token = this.jwservice.TokenObservable; 
   const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)  
  
  return this.http.get(environment.API_URI+'getproductsbyfilter/'+category_id+'/'+counter, {headers: headers});
}

/**OBTENER PRODUCTO, CON EL ID ESPECÍFICO */
getProduct_detail(id_product : number){
  /**OBTENER VALORES DE UN PRODUCTO ESPECÍFICO ES DE CIR LA INFO MAS GENERAL
 * LOS ITEMS SE OBTIENEN EN OTRA CONSULTA
*/
const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token); 

  return this.http.get(environment.API_URI+'getproductdetail/'+id_product,{headers: headers});
}


getproductsquantity(){
  /**VERIFICA LA CANTIDAD DE PRODUCTOS QUE HAY EN LA TABLA */
  return this.http.get(environment.API_URI+'getproductsquantity');
} 



getcategoriesquantity(){
  /**VERIFICA LA CANTIDAD DE CATEGORÍAS QUE HAY EN LA TABLA */
  return this.http.get(environment.API_URI+'getcategoriesquantity');
} 

getimagesquantity(){
  /**VERIFICA LA CANTIDAD DE IMAGENES QUE HAY EN LA TABLA */
  return this.http.get(environment.API_URI+'getimagesquantity');
}

getproductsquantity_onfilter(id_category : number){
 
  return this.http.get(environment.API_URI+'getproductsquantity_byfilter/'+id_category);
}

/**Selecciona el array que contiene los grupos y los items de un platillo específico */
get_products_items(id_product : number){

  
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token); 

  return this.http.get(environment.API_URI+'getproductitems/'+id_product,{headers: headers});
  
}

saveGalleryelement(image: File)
{
   /*PARA SALVAR UNA NUEVA IMAGEN EN LA GALERÍA*/ 

 
  const fd= new FormData();
  fd.append('image',image);

  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token); 

  return this.http.post(environment.API_URI+'gallery',fd,{headers: headers});  

}


saveCategory(category : Category)
{
  //alert("esto "+category.id_category+" "+category.name+" "+category.description+" "+category.image+" "+category.has_image);
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);   
  return this.http.post(environment.API_URI+'categories',category,{headers: headers});  
   
}

editCategory(category : Category)
{
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
  
  return this.http.put(environment.API_URI+'categoriesupdate/'+category.id_category,category,{headers: headers});  
   
}

editProduct_quickly(product : Dish_register)
{
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);  
  //alert("esto "+category.id_category+" "+category.name+" "+category.description+" "+category.image+" "+category.has_image); 
  return this.http.put(environment.API_URI+'product_quickly/'+product.id_product,product,{headers: headers});  
   
}

/*editProduct_quickly2(product : Dish_register)
{
  
  //alert("esto "+category.id_category+" "+category.name+" "+category.description+" "+category.image+" "+category.has_image); 
  return this.http.put(environment.API_URI+'product_quickly/'+product.id_product,product);  
   
}*/
edit_dish(product: Dish_register){
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
  
  return this.http.put(environment.API_URI+"productdetail/"+product.id_product,product,{headers: headers});    
}

deleteCategory(id:string){  
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
  return this.http.delete(environment.API_URI+"categoriesdelete/"+id,{headers: headers});          
}

deleteDish(id:string){
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
  return this.http.delete(environment.API_URI+"productsdelete/"+id,{headers: headers});          
}

deleteGalleryElement( element: Gallery_element){  
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
  /**se mando como put porque con delete solo aceptaba parametros */
  return this.http.put(environment.API_URI+"deleteGallery_element/"+element.id_gallery, element,{headers: headers});          
}

  saving_dish(dish : Dish_register)
  {  
    const token = this.jwservice.TokenObservable; 
    const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
    
    return this.http.post(environment.API_URI+'dishes/add',dish,{headers: headers});
     
  }
  

  /**SERVICIOS PARA ORDENES 
   * ____________________________________________________________________
   * __________________________________________________________________________
  */
 
  /**OBTENER ORDENES, CON EL PARAMETRO order_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getOrders_count(order_count :string, orderstate :string){
/**OBTIENE LAS ORDENES QUE SE VERAN EN EL LISTADO GENERAL DE ORDENES */
  const token = this.jwservice.TokenObservable; 
    const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token)
    
  return this.http.get(environment.API_URI+'getcounted_orders/'+order_count+'/'+orderstate,{headers: headers});
}
 
get_order_detail(orderdetail_id : number){
  /**OBTIENE LOS DATOS GENERALES DE UNA ORDEN ESPECIFICA */
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);
  return this.http.get(environment.API_URI+'getorder_detail/'+orderdetail_id,{headers: headers});
}
 
get_products_order_detail(orderdetail_id : number){
  /**OBTIENE EL DETALLE DE ORDEN DE UNA EN ESPECIFICO */
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);
  return this.http.get(environment.API_URI+'getproducts_order_detail/'+orderdetail_id,{headers: headers});
}

get_orderitems_detail(orderdetail_id : number){
   /**OBTIENE LOS ITEMS DE UNA ORDEN ESPECIFICA */
   const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);
  return this.http.get(environment.API_URI+'get_orderitems_detail/'+orderdetail_id,{headers: headers});
}

get_orders_quantity(orderstate :string){

  return this.http.get(environment.API_URI+'get_ordersquantity/'+orderstate);
}

update_orderstate(order_id: number, order_state :string){
  const token = this.jwservice.TokenObservable; 
  const headers = new HttpHeaders().set('Authorization','Bearer '+token.Token);

  return this.http.get(environment.API_URI+'update_orderstate/'+order_id+'/'+order_state,{headers: headers});
}

/**AUTENTICAR ADMIN */
 autentication(user_data: Userload){
   return this.http.post(environment.API_URI+'admin/user',user_data);
  }

}
