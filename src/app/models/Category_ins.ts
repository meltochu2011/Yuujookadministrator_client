/*MODELO QUE SIRVE PARA LOS DATOS QUE SE VAN A INSERTAR A LA HORA DE CRREAR
UNA NUEVA CATEGORÍA________________________________________________________*/


export interface Category_ins{
    id_category?: number;
    name?: string;
    description?: string;  
    image?:string;
    has_image?:number;
    selected?:string;
   }