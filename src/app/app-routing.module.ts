import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DishListComponent} from './components/dish-list/dish-list.component';
import {OrdersListComponent} from './components/orders-list/orders-list.component';

import {DishFormComponent} from './components/dish-form/dish-form.component';
import {CategoriesComponent} from './components/categories/categories.component';
import { EditdishDetailComponent } from './components/editdish-detail/editdish-detail.component';
import { LoginuserComponent } from './components/loginuser/loginuser.component';
import { OrdersListCompletedComponent } from './components/orders-list-completed/orders-list-completed.component';
import { JsonwtService} from './services/jsonwt.service';
import { AppComponent } from './app.component';

 const value = JsonwtService;
const routes: Routes = [
  
  {    
    path:'',        
    redirectTo: 'dishes/orders_list',
    pathMatch:'full'
    
   } ,

   /*Yuujook */
   /*{
    path: 'dishes/begin',
    component:AppComponent

   },*/

   {
    path: 'dishes/login',
    component:LoginuserComponent

   },

   {
    //LLAMAR A LAS CATEGORÍAS
    path:'categories',
    component: CategoriesComponent
  },
    //AGREGAR CATEGORÍAS
  {
    path: 'categories/add',
    component:CategoriesComponent

  },
  
 
  {
    /**LISTAR CATEGORÍAS */
    path: 'dishes/categories',
    component:CategoriesComponent
   },


   {
    /**LISTAR PLATILLOS */
     path:'dishes',
     component: DishListComponent
   },
   {
     /**AGREGAR PLATILLOS */
     path: 'dishes/add',
     component:DishFormComponent

   },

   {
     /**EDITAR PLATILLOS */
    path: 'dishes/edit_dish',
    component:EditdishDetailComponent
   },
   
   {
     /**LISTAR ORDENES EN PROCESO */
    path: 'dishes/orders_list',
    component:OrdersListComponent
   },

   {
    /**LISTAR ORDENES COMPLETADAS */
   path: 'dishes/orders_list_completed',
   component:OrdersListCompletedComponent
   },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
