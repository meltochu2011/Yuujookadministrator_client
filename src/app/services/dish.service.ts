import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from '../models/Category'
import { Dish_register } from '../models/Dish_register';
import { Gallery_element } from '../models/Gallery_element';
import {environment} from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class DishService {

  
  constructor(private http: HttpClient) { }

  /*yuujook*/

getCategories(){
  
  return this.http.get(environment.API_URI+'categories');
}  


 
getSelected_categories(id_product: number){
/** OBTENER CATEGORÍAS A LAS QUE PERTENECE UN PRODUCTO ESPECÍFICO */
  return this.http.get(environment.API_URI+'specific_product_categories/'+id_product);
}


/**OBTENER CATEGORÍAS, CON EL PARAMETRO cat_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getCategories_pagecount(cat_count : string){
  
  return this.http.get(environment.API_URI+'categories_pagecount/'+cat_count);
}

/**OBTENER CATEGORÍAS, CON EL PARAMETRO cat_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getGallery(image_count :string){
  
  return this.http.get(environment.API_URI+'getgallery/'+image_count);
}

/**OBTENER PRODUCTOS, CON EL PARAMETRO prod_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getProducts(prod_count :string){
  
  return this.http.get(environment.API_URI+'getproducts/'+prod_count);
}

/**OBTENER PRODUCTOS, CON EL PARAMETRO prod_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getProducts_byfilter( category_id :string, counter : string){

  
  return this.http.get(environment.API_URI+'getproductsbyfilter/'+category_id+'/'+counter);
}

/**OBTENER PRODUCTO, CON EL ID ESPECÍFICO */
getProduct_detail(id_product : number){
  
  return this.http.get(environment.API_URI+'getproductdetail/'+id_product);
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

  return this.http.get(environment.API_URI+'getproductitems/'+id_product);
  
}

saveGalleryelement(image: File)
{
   /*PARA SALVAR UNA NUEVA IMAGEN EN LA GALERÍA*/ 

 
  const fd= new FormData();
 
  fd.append('image',image);
  
  return this.http.post(environment.API_URI+'gallery',fd);  

}


saveCategory(category : Category)
{
  //alert("esto "+category.id_category+" "+category.name+" "+category.description+" "+category.image+" "+category.has_image);
    
  return this.http.post(environment.API_URI+'categories',category);  
   
}

editCategory(category : Category)
{
  
  //alert("esto "+category.id_category+" "+category.name+" "+category.description+" "+category.image+" "+category.has_image); 
  return this.http.put(environment.API_URI+'categories/'+category.id_category,category);  
   
}

editProduct_quickly(product : Dish_register)
{
  
  //alert("esto "+category.id_category+" "+category.name+" "+category.description+" "+category.image+" "+category.has_image); 
  return this.http.put(environment.API_URI+'product_quickly/'+product.id_product,product);  
   
}

/*editProduct_quickly2(product : Dish_register)
{
  
  //alert("esto "+category.id_category+" "+category.name+" "+category.description+" "+category.image+" "+category.has_image); 
  return this.http.put(environment.API_URI+'product_quickly/'+product.id_product,product);  
   
}*/
edit_dish(product: Dish_register){
  /*console.log("esta llegando a dish.service "+product.id_product);
  console.log(environment.API_URI);*/
  
  return this.http.put(environment.API_URI+"productdetail/"+product.id_product,product);    
}

deleteCategory(id:string){  
  return this.http.delete(environment.API_URI+"categories/"+id);          
}

deleteDish(id:string){
  
  return this.http.delete(environment.API_URI+"products/"+id);          
}

deleteGalleryElement( element: Gallery_element){  
   
  /**se mando como put porque con delete solo aceptaba parametros */
  return this.http.put(environment.API_URI+"Gallery_element/"+element.id_gallery, element);          
}

  saving_dish(dish : Dish_register)
  {
  
    return this.http.post(environment.API_URI+'dishes/add',dish);
     
  }
  

  /**SERVICIOS PARA ORDENES 
   * ____________________________________________________________________
   * __________________________________________________________________________
  */
 
  /**OBTENER PRODUCTOS, CON EL PARAMETRO prod_count SE LE INDICA DONDE EMPIEZA LA PAGINACION */
getOrders_count(order_count :string, orderstate :string){
  
  return this.http.get(environment.API_URI+'getcounted_orders/'+order_count+'/'+orderstate);
}
 
get_order_detail(orderdetail_id : number){

  return this.http.get(environment.API_URI+'getorder_detail/'+orderdetail_id);
}
 
get_products_order_detail(orderdetail_id : number){

  return this.http.get(environment.API_URI+'getproducts_order_detail/'+orderdetail_id);
}

get_orderitems_detail(orderdetail_id : number){

  return this.http.get(environment.API_URI+'get_orderitems_detail/'+orderdetail_id);
}

get_orders_quantity(orderstate :string){

  return this.http.get(environment.API_URI+'get_ordersquantity/'+orderstate);
}

update_orderstate(order_id: number, order_state :string){

  return this.http.get(environment.API_URI+'update_orderstate/'+order_id+'/'+order_state);
}

}
