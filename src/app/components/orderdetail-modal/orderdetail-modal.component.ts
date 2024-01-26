import { Component, OnInit } from '@angular/core';
import {DishService} from '../../services/dish.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-orderdetail-modal',
  templateUrl: './orderdetail-modal.component.html',
  styleUrls: ['./orderdetail-modal.component.css']
})
export class OrderdetailModalComponent implements OnInit {

  constructor(private dishService: DishService) {

   /* this.orderdetail_id=environment.orderdetail_id;   
    alert("id entrante"+environment.orderdetail_id);
    this.getOrder_detail(this.orderdetail_id); */
   }

  ngOnInit(): void {
   
  }

orderdetail_id : number = 0 ;

  /**Para cambiar la forma del cursor mientras se carga algo*/
 public loading_gif : any|boolean;
 no_results : boolean = false;
 global_index_page=0;
 order_info: any =[];
 

  getOrder_detail(orderdetail_id: number)
  {
     
  
    /**PONER EL CURSOR EN MODO ESPERA */
    document.body.style.cursor = 'wait';
    this.loading_gif=true;
    //this.global_index_page=index_begining;
    this.no_results = false;
    //cantidad = this.global_category_count[0].count;
    //cantidad = this.global_category_count[0].count;*/
    //console.log("dato "+this.cantidad);
    this.dishService.get_order_detail(orderdetail_id).subscribe(
     
      res=> { 
        this.order_info=res;     
        this.loading_gif=false;  
        document.body.style.cursor = 'default';      
      },
      err=> {
        
        this.no_results=true,
        this.loading_gif=false,
        document.body.style.cursor = 'default'
        } 
    );
  }


}
