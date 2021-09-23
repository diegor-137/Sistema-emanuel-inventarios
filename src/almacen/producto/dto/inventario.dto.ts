import { IsNotEmpty } from 'class-validator';

export class InventarioDto {
    @IsNotEmpty()
    cantidad
}