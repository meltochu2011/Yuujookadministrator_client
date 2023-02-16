import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DishListComponent} from './components/dish-list/dish-list.component';
import {OrdersListComponent} from './components/orders-list/orders-list.component';

import {DishFormComponent} from './components/dish-form/dish-form.component';
import {CategoriesComponent} from './components/categories/categories.component';
import { EditdishDetailComponent } from './components/editdish-detail/editdish-detail.component';
import { LoginuserComponent } from './components/loginuser/loginuser.component';





const routes: Routes = [
   {
    path:'',
    redirectTo: '/users/add',
    //redirectTo: '/users/add', 
    pathMatch:'full'
    
   } ,

   /*Yuujook */

   {
    path: 'users/add',
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
    path: 'dishes/categories',
    component:CategoriesComponent
   },


   {
     path:'dishes',
     component: DishListComponent
   },
   {
     path: 'dishes/add',
     component:DishFormComponent

   },

   {
    path: 'dishes/edit_dish',
    component:EditdishDetailComponent
   },
   
   {
    path: 'dishes/orders_list',
    component:OrdersListComponent
   }
   
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
