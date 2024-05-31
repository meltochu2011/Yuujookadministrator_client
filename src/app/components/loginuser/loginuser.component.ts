import { Component, OnInit } from '@angular/core';
import { Userload } from 'src/app/models/Userload';
import { DishService } from 'src/app/services/dish.service';
import {Component_token, JsonwtService} from 'src/app/services/jsonwt.service'
import {  Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-loginuser',
  templateUrl: './loginuser.component.html',
  styleUrls: ['./loginuser.component.css'],
  //standalone: true,
  
})



export class LoginuserComponent implements OnInit {
 
  
  
  hide = true;

     value : boolean = false;
  constructor(private dishService: DishService, private tokenSvc : JsonwtService) { 
      this.value = this.tokenSvc.TokenObservablecheck        
        
        
        if(this.value == false )
        {
           this.tokenvalue ="";
        }
       
        else if(this.value != true)
        {
            this.tokenvalue = this.tokenSvc.TokenObservable;
            
        }
        

  }

  ngOnInit(): void {
   
  }

  Userdata: Userload =
  {
    user_name:'',
    user_pass:''
  };

  
  
  
    access_result : any;
    public loading : any|boolean;
    


    Token$: Observable<Component_token> | undefined;
    //value: Subscription | undefined;
    tokenvalue : string | any; 
  login_account()
  {
              /*alert(this.Userdata.user_name);*/
       this.loading = true;
       this.dishService.autentication(this.Userdata)
       .subscribe(
        res =>{
          this.access_result = res;
         
          if(this.access_result.token == "notloggedin"){
           
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "error",
              title: "Usuario o contraseña invalidas"
            });

             this.Userdata.user_name = "";
             this.Userdata.user_pass = "";

          }  

           else{

            this.tokenSvc.TokenObservableData = {Token : this.access_result.token}
            window.location.reload();
             
           }
          this.loading= false;
        },
        
        err =>
        {
         console.log(err);
         this.loading = false;
         alert("Ha ocurrido un error de conexion");         
        }
       )
  }

  login_validate_access()
  {
      
       if(this.Userdata.user_name == "" ||  this.Userdata.user_pass == "" || this.Userdata.user_name == null ||  this.Userdata.user_pass == null)  
       {
        /*Swal.fire({
          icon: "error",
          title: "Hay campos vacíos",
          text: "Por favor complete el usuario y la contraseña!",
          footer: '<a href="#">Campos incompletos</a>'
        });*/

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Ingrese usuario y contraseña"
        });
        
       }   
  
       else
       {
        this.login_account();
       }
  }


   
  

}


