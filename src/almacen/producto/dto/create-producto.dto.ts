import { TransformPlainToClass, Type } from "class-transformer";
import { IsEnum, IsInstance, IsNumber, IsOptional, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Categoria } from "src/almacen/categoria/entity/categoria.entity";
import { Marca } from "src/almacen/marca/entities/marca.entity";
import { Foto } from '../entities/foto.entity';



export class CreateProductoDto {

    @IsString()
    descripcion: string

    @IsNumber()
    @IsOptional()
    codigoBarras: number

    @IsString()
    @IsOptional()
    foto : string

    @IsOptional()  
    categoria: Categoria;
    
    @IsOptional()
    marca: Marca;
    
    fotos : Foto[];

}



