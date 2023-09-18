 export interface ListGeneralProd {
    header:Header  
    resultado : any[]
 }



 export interface Header {
    documento:string,
    sucursal:{
        nombre:string,
        direccion:string
    }
    empleado:{
        nombre:string
        apellido:string
    }
}


 export interface HeaderWithDate {
    documento:string,
    sucursal:{
        nombre:string,
        direccion:string
    }
    empleado:{
        nombre:string
        apellido:string
    }
    periodo:string
}

 export interface ListKardex {
    header:HeaderWithDate  
    resultado : any[]
 }

