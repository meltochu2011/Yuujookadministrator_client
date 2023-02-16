import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DishService } from './services/dish.service';
import {HttpClientModule} from '@angular/common/http'
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { FormsModule} from '@angular/forms';

import { CategoriesComponent } from './components/categories/categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule,MatListOption} from '@angular/material/list'; 
import { ReactiveFormsModule} from '@angular/forms';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { CcompartidoComponent } from './components/ccompartido/ccompartido.component';

import { FooterCompComponent } from './components/footer-comp/footer-comp.component';
import { ModalsComponent } from './components/modals/modals.component';
import { CoreModule} from './core/core.module';
import { EditdishDetailComponent } from './components/editdish-detail/editdish-detail.component';
import { LoginuserComponent } from './components/loginuser/loginuser.component';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DishFormComponent,  
    DishListComponent, 
    CategoriesComponent,
    OrdersListComponent,
    CcompartidoComponent,
    FooterCompComponent,
    ModalsComponent,
    EditdishDetailComponent,
    LoginuserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  
    BrowserAnimationsModule,
    MatListModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    CoreModule
  ],
  providers: [DishService],
  bootstrap: [AppComponent]
})

export class AppModule { }
