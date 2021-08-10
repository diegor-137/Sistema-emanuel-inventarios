import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';


export class EditPedidoDto extends PartialType(
    OmitType(CreatePedidoDto,['empleado'] as const))
    {
        
    }