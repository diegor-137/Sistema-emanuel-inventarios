import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { getConnection, getRepository } from 'typeorm';
import { DataService } from '../../common/service/common.service';
import { Venta } from './entity/venta.entity';
import { InventarioService } from '../../almacen/producto/services/inventario.service';
import { CuentasPorCobrarService } from 'src/creditos/cuentas-por-cobrar/cuentas-por-cobrar.service';
import { CreditoClienteService } from '../../creditos/credito-cliente/credito-cliente.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';


@Injectable()
export class VentaService extends DataService(Venta){
    constructor(private readonly invertarioService:InventarioService,
                private readonly cuentasPorCobrarService: CuentasPorCobrarService,    
                private readonly creditoClienteService: CreditoClienteService    
        ){super()}

    
    @Transactional()
    async CreateOne(dto:CreateVentaDto, empleado:Empleado){
        //return console.log('object :>> ', dto);
        /* const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try { */
            dto.pago.code? dto.status = 'CREDITO':null;
            const venta = this.repository.create(dto)
            const saved =  await this.repository.save(venta)                        
            //await this.invertarioService.Egreso(saved)
            if(dto.pago.code){
                await this.creditoClienteService.findOneAndAllowCredit(saved, empleado)
                await this.cuentasPorCobrarService.create(saved, empleado);
                console.log('Se ha guardo el credito!');                
            }
            return saved
            /* throw new Error
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return saved
            
        } catch (err) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return err.detail
        }finally{
            await queryRunner.release()   
        } */
    }

    async FindOne_Venta(id:number){
        return await this.repository.findOne({
            where:[{id}],
            relations:[
                "empleado",
                "cliente",
                "sucursal",
                "detalle",
                "detalle.producto"
            ]
        })
    }

    async FindMany_Venta(){
        return await getRepository(Venta)
        .createQueryBuilder("venta")
        .leftJoinAndSelect("venta.empleado","empleado")
        .leftJoinAndSelect("venta.cliente","cliente")
        .leftJoinAndSelect("venta.sucursal","sucursal")
        .leftJoinAndSelect("venta.detalle","detalle")
        .select(["venta.id as id",
        "cliente.nombre as cliente","sucursal.nombre as sucursal",
        "venta.created_At","SUM(detalle.cantidad*detalle.precio_venta)as total"])
        //.select(["empleado.nombre","proveedor.nombre","sucursal.nombre",
        //"detalle"])
        .groupBy("venta.id,cliente.nombre,venta.created_At,sucursal.nombre")
        .getRawMany()
    }

}
