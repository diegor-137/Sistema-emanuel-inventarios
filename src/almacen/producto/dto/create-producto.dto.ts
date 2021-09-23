import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Categoria } from "src/almacen/categoria/entity/categoria.entity";
import { Foto } from '../entities/foto.entity';
import { PrecioDto } from './precio.dto';
import { MarcaDto } from '../../marca/dto/marca.dto';
import { CategoriaDto } from '../../categoria/dtos/categoria.dto';
import { Marca } from '../../marca/entities/marca.entity';
import { Precio } from '../entities/precio.entity';
import { Inventario } from '../entities/inventario.entity';
import { InventarioDto } from "./inventario.dto";
import { Optional } from "@nestjs/common";


export class CreateProductoDto {

    @IsString()
    descripcion: string

    @IsNumber()
    @IsOptional()
    codigoBarras: number

    @Type(()=> CategoriaDto)
    @ValidateNested()  
    categoria: CategoriaDto;
       
    @Type(()=> MarcaDto)
    @ValidateNested()
    marca: MarcaDto;
    
    @IsOptional()
    fotos : Foto[];

    @Type(()=> PrecioDto)
    @ValidateNested({each: true})
    precio: Precio;

    @Optional()
    Inventario:Inventario[]
}



