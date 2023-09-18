
 export interface ResultUtility {
    header:Header  
    result : any[], 
    venta:number, 
    compra:number, 
    utilidad:number
 }

 interface Header {
    documento:string,
    sucursal:{
        nombre:string,
        direccion:string
    }
    empleado:{
        nombre:string
        apellido:string
    }
    periodo?:string
}

export interface ResultReportGeneric{
        header:Header
        result: any[], 
        total?:number
}