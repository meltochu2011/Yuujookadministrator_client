import { Component, OnInit } from '@angular/core';
import { Userload } from 'src/app/models/Userload';
import { DishService } from 'src/app/services/dish.service';
import {CookieService} from 'ngx-cookie-service';
import {JsonwtService} from 'src/app/services/jsonwt.service'


@Component({
  selector: 'app-loginuser',
  templateUrl: './loginuser.component.html',
  styleUrls: ['./loginuser.component.css']
})
export class LoginuserComponent implements OnInit {

  constructor(private dishService: DishService, private tokenSvc : JsonwtService) { 
   
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
    
  login_account()
  {
       /*alert("entra");
       alert(this.Userdata.user_name);*/
       this.loading = true;
       this.dishService.autentication(this.Userdata)
       .subscribe(
        res =>{
          this.access_result = res;
         
          if(this.access_result.token == "notloggedin"){
            alert("no se encontro al usuario");            
          }  

           else{
        
             this.tokenSvc.TokenObservableData =  {Token : this.access_result.token}
           }
          this.loading= false;
        },
        err => console.log(err)
       )
  }

}
