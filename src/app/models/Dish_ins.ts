/*MODELO QUE SIRVE PARA LOS DATOS QUE SE VAN A INSERTAR A LA HORA DE CRREAR
UNA NUEVA CATEGORÍA________________________________________________________*/


export interface Dish_ins{
    id_product?: number;
    name?: string;
    description?: string; 
    price?: string;      
    image?:string;
    is_enable?: number;
    has_image?: number;
    
   }