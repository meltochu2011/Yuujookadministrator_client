import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DishService } from './services/dish.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { FormsModule} from '@angular/forms';

import { CategoriesComponent } from './components/categories/categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule,MatListOption} from '@angular/material/list'; 
import { ReactiveFormsModule} from '@angular/forms';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { OrdersListComponent, } from './components/orders-list/orders-list.component';
import { FooterCompComponent } from './components/footer-comp/footer-comp.component';

import { CoreModule} from './core/core.module';
import { EditdishDetailComponent } from './components/editdish-detail/editdish-detail.component';
import { LoginuserComponent } from './components/loginuser/loginuser.component';
import { CookieService } from 'ngx-cookie-service';
import { GallerycompComponent } from './components/gallerycomp/gallerycomp.component';
import { OrderdetailModalComponent } from './components/orderdetail-modal/orderdetail-modal.component';
import { WebSocketService } from './services/web-socket.service';
import { OrdersListCompletedComponent } from './components/orders-list-completed/orders-list-completed.component';
//import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SppinerInterceptor } from './components/sppiner-interceptor';
/**INICIO */
import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { JsonwtService } from './services/jsonwt.service';





@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DishFormComponent,  
    DishListComponent, 
    CategoriesComponent,
    OrdersListComponent,   
    FooterCompComponent,
    EditdishDetailComponent,
    LoginuserComponent,
    GallerycompComponent,
    OrderdetailModalComponent,
    OrdersListCompletedComponent,
    SpinnerComponent
   
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
    CoreModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [DishService,CookieService,WebSocketService,JsonwtService, 
  {provide : HTTP_INTERCEPTORS, useClass: SppinerInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
