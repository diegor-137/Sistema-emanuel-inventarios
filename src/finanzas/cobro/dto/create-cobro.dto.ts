import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty, ValidateNested, ArrayNotEmpty, IsString } from 'class-validator';
import { Caja } from 'src/finanzas/caja/entities/caja.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Venta } from '../../../ventas/venta/entity/venta.entity';
import { DetalleCobro } from '../entities/detalle-cobro';
import { CreateDetalleCobroDto } from './create-detalle-cobro.dto';


export class CreateCobroDto {

    @IsOptional()
    empleado:Empleado

    @IsNotEmpty()
    venta:Venta

    @IsString()
    @IsOptional()
    token?:string

    caja?:Caja

    @Type(()=> CreateDetalleCobroDto)
    @ValidateNested({each: true})
    @ArrayNotEmpty()
    detalleCobro: CreateDetalleCobroDto[];

}
