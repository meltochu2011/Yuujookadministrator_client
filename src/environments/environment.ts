// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  //My RAILWAY 
   
  API_URI: 'https://nuevo-production-983c.up.railway.app/',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
