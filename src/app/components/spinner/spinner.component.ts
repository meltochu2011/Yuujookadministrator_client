import { Component } from '@angular/core';
import { SppinerService } from 'src/app/services/spinner.service';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  
     isLoading$ = this.sppinerSvc.isLoading$;
     constructor(private readonly sppinerSvc : SppinerService){
         this.sppinerSvc.hide();
     }

}
