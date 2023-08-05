
     function description_validation(formChild) {
      /**VALIDA QUE LA DESCRIPCION DE LOS GRUPOS NO ESTE VACÍO
       * SI ESTA VACIO  PINTA EL INPUT DE COLOR ROJO
       * DE LO CONTRARIO LO DEJA CON EL MISMO COLOR
      */
      
      var campo = document.getElementById(formChild);

      if (campo.value == '' || campo.value == null) {
              
        campo.style.borderColor="red";        

      }
        
     if(campo.value != '')
         {
          campo.style.borderColor="lightgray";
         }      
       
  }


     
  function maxselected_validation(formChild) {
      /**VALIDA QUE EL VALOR MAXIMO SELECCIONADO DE LOS GRUPOS NO ESTE VACÍO Y TAMPOCO CON VALOR 0 
       * SI ESTA VACIO O CON VALOR 0 PINTA EL INPUT DE COLOR ROJO
       * DE LO CONTRARIO LO DEJA CON EL MISMO COLOR
      */
      
    var max_selected = document.getElementById(formChild);
    

    if (max_selected.value == '' || max_selected.value == null || max_selected.value == 0) {

    max_selected.style.borderColor="red";
   }
        
    if(max_selected.value != '' && max_selected.value > 0)
       {
        max_selected.style.borderColor="lightgray";
       }

        
     
}


/*let global = 0;

function Global_group(position) {
  
  global=position;
  //alert("el global "+global);

  /*var descri = document.getElementById(formChild);
  var campo = document.getElementById('description');

  
  if(document.getElementById(formChild) != "")
  {
    
    myFunction_modal(formChild);
  }
*/
  
/*}


function actualizar_grupo() {
 

document.getElementById(global).value=document.getElementById("description").value;
document.getElementById("max_selected"+global).value=document.getElementById("max_sele").value;


  /*document.getElementById("description").value="";
  document.getElementById("max_sele").value="" */

  /*myFunction_modal_reverse(global);
  
}




/*DETECTAR CAMPOS VACÍOS EN EL MODAL DEL DETALLE UNICAMENTE LOS DOS CAMPOS DEL GRUPO name y max_sele que son la
descripcion del grupo y el numero maximo seleccionable*/ 

/*function myFunction_modal(formChild) {


      /**VALIDAR PRIMER CAMPO */

   
  /*var campo = document.getElementById(formChild);
  var descri = document.getElementById('description');
   
  
  if (campo.value == '') {
   
    descri.style.borderColor="red";        
  }
    
 if(campo.value != '')
     {
      descri.style.borderColor="lightgray";
     }

     /**VALIDAR SEGUNDO CAMPO */

    /* var campo2 = document.getElementById('max_selected'+formChild);
     var max_selected = document.getElementById('max_sele');

     if (campo2.value == '' ) {
      
     max_selected.style.borderColor="red";
    }
         
     if(campo2.value != '' )
        {
         max_selected.style.borderColor="lightgray";
        }
   
}


function myFunction_modal_reverse(formChild) {


  /**VALIDAR PRIMER CAMPO */
/*var campo = document.getElementById(formChild);
var descri = document.getElementById('description');


if (descri.value == '') {

campo.style.borderColor="red";        
}

if(descri.value != '')
 {
  campo.style.borderColor="lightgray";
 }

 /**VALIDAR SEGUNDO CAMPO */

/* var campo2 = document.getElementById('max_selected'+formChild);
 var max_selected = document.getElementById('max_sele');

 

 if (max_selected.value == '' ) {
  
 campo2.style.borderColor="red";
}
     
 if(max_selected.value != '' )
    {
     campo2.style.borderColor="lightgray";
    }

}





function valid_description() {


      
  var campo = document.getElementById("description");

  if (campo.value == '') {
   
    
    campo.style.borderColor="red";        

  }
    
 if(campo.value != '')
     {
      campo.style.borderColor="lightgray";
     }
  
   
}

function valid_maxselected() {
  
  var max_selected = document.getElementById("max_sele");


  if (max_selected.value == '' ) {
   
  max_selected.style.borderColor="red";
 }
      
  if(max_selected.value != '' )
     {
      max_selected.style.borderColor="lightgray";
     }

     //alert(max_selected.value);        
   
}*/