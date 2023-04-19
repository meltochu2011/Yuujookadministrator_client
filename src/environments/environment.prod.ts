export const environment = {
   production: true,
  //My RAILWAY 
   
  API_URI: 'https://nuevo-production.up.railway.app/',
    //API_URI: 'http://localhost:4000/',
  
    
  /**VARIABLES PARA LA GALERÍA */
  Dish_image : "",
  Socket_state : 0,
  User_state : 1,

  /**AQUI SE MANEJAN 3 POSIBLES ESTADOS 
   * -1 PARA TODAS LAS CATEGORÍAS
   *  0 PARA PRODUCTOS SIN CATEGORÍAS
   *  1 EN ADELANTE UNA CATEGORÍA ESPECIFICA
  */
 
  filter_var : -1,
  
  /** INDICA EL NUMERO DE LA PAGINA EN LA QUE NOS ENCONTRAMOS ACTUALMENTE */
  pagevalue : 1,

  /**VARIABLES PARA ORDENES */
   orderdetail_id : 0
};
