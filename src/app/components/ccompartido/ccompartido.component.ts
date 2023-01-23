import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ccompartido',
  templateUrl: './ccompartido.component.html',
  styleUrls: ['./ccompartido.component.css']
})
export class CcompartidoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  prueba_compartida(){

      alert("holita compartido");
    }


}
