import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Categoria } from "src/almacen/categoria/entity/categoria.entity";
import { Foto } from '../entities/foto.entity';
import { PrecioDto } from './precio.dto';
import { Marca } from '../../marca/entities/marca.entity';
import { Precio } from '../entities/precio.entity';
import { Inventario } from '../entities/inventario.entity';
import { Optional } from "@nestjs/common";


export class CreateProductoDto {

    @IsString()
    nombre: string

    @IsString()
    descripcion: string

    @IsNumber()
    @IsOptional()
    codigoBarras: number

    @IsBoolean()
    estado:boolean

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    costo_prom:number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    costo_prom_old:number


    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ultimo_precio:number

    //@Type(()=> CategoriaDto)
    //@ValidateNested()  
    //categoria: CategoriaDto;
       
    //@Type(()=> MarcaDto)
    //@ValidateNested()
    //marca: MarcaDto;
    
    @IsOptional()
    categoria:Categoria

    @IsOptional()
    marca:Marca

    @IsOptional()
    fotos : Foto[];

    @Optional()
    @Type(()=> PrecioDto)
    @ValidateNested({each: true})
    precio: Precio[];

    @Optional()
    Inventario:Inventario[]
}



