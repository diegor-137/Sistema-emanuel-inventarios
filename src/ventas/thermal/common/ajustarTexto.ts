export function ajustarTexto(texto:string){
    var newText:string = "";
    
    let contador = 0;
    const divisiones = texto.split(" ");
    divisiones.forEach(obj => {
      
        var resta = 43 - contador;
        if(obj.length<resta){
            newText += obj + " " 
          contador += obj.length + 1;
        }else{
          contador=0;
          newText += "\n" + obj + " "
          contador += obj.length + 1;
        }      
    })
    return newText;
}