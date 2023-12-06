import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaService } from 'src/ventas/venta/services/venta.service';
import { IsNull, Repository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CuentaBancaria } from './entities/cuenta-bancaria';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { User } from 'src/user/entities/user.entity';
import { DetalleCuentaBancaria } from './entities/detalle-cuenta-bancaria';
import { CreateDetalleCuentaBancariaDto } from './dto/create-detalle-cuenta-bancaria.dto';

const start = new Date();
start.setHours(0, 0, 0, 0);
const end = new Date(start);
end.setDate(start.getDate() + 1);

@Injectable()
export class CuentaBancariaService {

  constructor(
    @InjectRepository(CuentaBancaria)
    public readonly cuentaBancariaRepository: Repository<CuentaBancaria>,
    @InjectRepository(DetalleCuentaBancaria)
    public readonly detalleCuentaBancaria: Repository<DetalleCuentaBancaria>,
  ) { }
  
  @Transactional()
  async create(createCuentaBancariaDto:CreateCuentaBancariaDto, user:User){
    createCuentaBancariaDto.empleado = user.empleado
    createCuentaBancariaDto.region = user.empleado.sucursal.region
    createCuentaBancariaDto.detalleCuentaBancaria.forEach((data)=>{
      data.balance = data.monto,
      data.empleado = user.empleado
    })
    const cuentaBancaria = this.cuentaBancariaRepository.create(createCuentaBancariaDto);
    return this.cuentaBancariaRepository.save(cuentaBancaria)
  }

/*   async transaccion(array:any[], user:User, id:number){
    const {balance} = await this.ultimoMovimiento(id);    
    const cuenta:CuentaBancaria={id}
    let bal = balance;
    let balance1:number;

    array.forEach(a=>{
      a.descripcion = `EGRESO POR PAGO CREDITO `
    })

    return await this.detalleCuentaBancaria.save(createDetalleCuentaBancariaDto);

  }  */

  async transaccion(createDetalleCuentaBancariaDto:CreateDetalleCuentaBancariaDto, user:User, id:number){
    const {balance} = await this.ultimoMovimiento(id);    
    if(Number(createDetalleCuentaBancariaDto.monto)>Number(balance) && createDetalleCuentaBancariaDto.type == false){
      throw new BadRequestException('El gasto no puede ser mayor al monto que se tiene en caja!')
    }
    const cuenta:CuentaBancaria={id}
    createDetalleCuentaBancariaDto.empleado = user.empleado
    createDetalleCuentaBancariaDto.cuentaBancaria = cuenta;
    let balance1:number;
    switch (createDetalleCuentaBancariaDto.type) {
      case true:balance1 = Number(balance) + Number(createDetalleCuentaBancariaDto.monto) ;        
        break;
      case false:balance1 = Number(balance) - Number(createDetalleCuentaBancariaDto.monto);
        break;     
    }        
    createDetalleCuentaBancariaDto.balance = balance1;
    const result = await this.detalleCuentaBancaria.save(createDetalleCuentaBancariaDto);
    return result;

  } 


/*   async ultimoMovimiento(idCuenta:number){
    return await this.detalleCuentaBancaria.createQueryBuilder("detalle_cuenta_bancaria")
    .where("detalle_cuenta_bancaria.cuentaBancaria.id = :idCuenta", {idCuenta})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(detalle_cuenta_bancaria.fecha)", "fecha")
                  .from(DetalleCuentaBancaria, "detalle_cuenta_bancaria")                  
                  .where("detalle_cuenta_bancaria.cuentaBancaria.id = :idCuenta", {idCuenta})
                  .getQuery()
                  return "detalle_cuenta_bancaria.fecha = " + subQuery})
    .getOne()
  } */

  async ultimoMovimiento(idCuenta:number){
    return  await this.detalleCuentaBancaria.createQueryBuilder('detalle_cuenta_bancaria')
    .select()
    .where("detalle_cuenta_bancaria.cuentaBancaria.id = :idCuenta", {idCuenta})
    .orderBy('detalle_cuenta_bancaria.id', 'DESC')
    .getOne();
  }

  async getCuentas(user:User){

    return await this.cuentaBancariaRepository.createQueryBuilder('cuenta_bancaria')
    .leftJoinAndSelect("cuenta_bancaria.banco", "banco")
    .leftJoinAndSelect("cuenta_bancaria.region", "region")
    .leftJoinAndSelect(
      "cuenta_bancaria.detalleCuentaBancaria", "detalleCuentaBancaria", 
      "detalleCuentaBancaria.cuentaBancaria.id=cuenta_bancaria.id"
    )
    .where("cuenta_bancaria.region.id = :idRegion", {idRegion:user.empleado.sucursal.region.id})
    .andWhere(
      (query) =>
      "detalleCuentaBancaria.id=" +
      query
        .subQuery()
        .select("id")
        .from(DetalleCuentaBancaria, "d")
        .where("cuenta_bancaria.id=d.cuentaBancaria.id")
        .orderBy("fecha", "DESC")
        .limit(1)
        .getQuery()
    )
    .orWhere("detalleCuentaBancaria.id IS NULL")
    .orderBy("cuenta_bancaria.fecha", "ASC")
    .getMany()

    /* BUSCAR LA CUENTA Y MOSTRAR SU ULTIMO REGISTRO DE SU TABLA HIJA */
  }

  async getCuentasDetail(id:number, user:User){
    return (await this.common())
          .where("cuenta_bancaria.region.id = :idRegion", {idRegion:user.empleado.sucursal.region.id})
          .andWhere("cuenta_bancaria.id = :idCuenta", {idCuenta:id})
          .getOne()
  }

  async common(){
    const repo = await this.cuentaBancariaRepository.createQueryBuilder("cuenta_bancaria")
    .leftJoinAndSelect("cuenta_bancaria.detalleCuentaBancaria", "detalleCuentaBancaria")
    .leftJoinAndSelect("cuenta_bancaria.banco", "banco")
    .leftJoinAndSelect("detalleCuentaBancaria.empleado", "empleado")
    return repo;
  }

  async getCuentasEncabezado(user:User){
    return await this.cuentaBancariaRepository.createQueryBuilder("cuenta_bancaria")
    .leftJoinAndSelect('cuenta_bancaria.banco', 'banco')
    .where("cuenta_bancaria.region.id = :idRegion", {idRegion:user.empleado.sucursal.region.id})
    .getMany();
  }
}



/* 
.leftJoin("cuenta_bancaria.detalleCuentaBancaria", "detalleCuentaBancarias", "cuenta_bancaria.fecha < detalleCuentaBancarias.fecha")
    .where("detalleCuentaBancarias.id IS NULL")
    .andWhere("cuenta_bancaria.sucursal.id = :idSucursal", {idSucursal:user.empleado.sucursal.id})
    .getOne() */