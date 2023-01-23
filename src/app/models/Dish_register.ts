import { Byte } from "@angular/compiler/src/util";

export interface Dish_register{
 id_product?: number;
 name?: string;
 description?: string;
 price?: string;
 image?: string;
 selected_list?: any;
 group_list?: any;
 sons_list?: any;
 is_enable?:number,
 /**VALORES DE MANEJO DE FUNCIONALIDAD*/
 button_enable?: boolean,
 static_fields_var?: boolean,
 group_list_var ?: boolean,
 sons_list_var ?: boolean,
 selected_list_var?: boolean,
 has_image?: number

}