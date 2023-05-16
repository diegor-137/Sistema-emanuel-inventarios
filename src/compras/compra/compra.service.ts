import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Compra } from './entity/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { getConnection,getRepository } from 'typeorm';
import { InventarioService } from '../../almacen/producto/services/inventario.service';
import { CuentaPorPagarService } from 'src/creditos/cuentas-por-pagar/cuenta-por-pagar.service';
import { CreditoProveedorService } from 'src/creditos/credito-proveedor/credito-proveedor.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';


@Injectable()
export class CompraService extends DataService(Compra) {
    constructor(private readonly inventarioService: InventarioService,
                private readonly cuentaPorPagarService: CuentaPorPagarService,
                private readonly creditoProveedorService: CreditoProveedorService
        ) {super()}

    @Transactional()
    async createOne(dto:CreateCompraDto){
        /* const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try { */
            const compra = this.repository.create(dto)
            const saved =  await this.repository.save(compra)
            //await this.inventarioService.Ingreso(saved)
            if(dto.pago.code){
                await this.creditoProveedorService.findOneAndAllowCredit(saved, dto.empleado)
                await this.cuentaPorPagarService.create(saved, dto.empleado);
            }
            /* await queryRunner.commitTransaction()
            await queryRunner.release() */
            return saved
        /* } catch (err) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return err.detail
        }finally{
            await queryRunner.release()   
        } */
    }

    async FindOne_Compra(id:number){
        return await this.repository.findOne({
            where:[{id}],
            relations:[
                "empleado",
                "proveedor",
                "sucursal",
                "detalle",
                "detalle.producto"
            ]
        })
    }

    async FindMany_Compra(){
        return await getRepository(Compra)
        .createQueryBuilder("compra")
        .leftJoinAndSelect("compra.empleado","empleado")
        .leftJoinAndSelect("compra.proveedor","proveedor")
        .leftJoinAndSelect("compra.sucursal","sucursal")
        .leftJoinAndSelect("compra.detalle","detalle")
        .select(["compra.id as id","compra.documento as documento",
        "proveedor.nombre as proveedor","sucursal.nombre as sucursal",
        "compra.created_At","SUM(detalle.cantidad*detalle.precio)as total"])
        //.select(["empleado.nombre","proveedor.nombre","sucursal.nombre",
        //"detalle_compra"])
        .groupBy("compra.id,compra.documento,proveedor.nombre,sucursal.nombre")
        .getRawMany()
    }

    async editOne(id:number , dto:CreateCompraDto){
        const compra = await this.repository.findOne(id);
        const editCompra = Object.assign(compra, dto);
        return await this.repository.save(editCompra);
    }
}
