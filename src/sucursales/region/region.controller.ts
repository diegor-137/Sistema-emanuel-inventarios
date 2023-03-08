import { Controller } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateRegionDto } from './dto/create-region.dto';
import { EditRegionDto } from './dto/edit-region.dto';
import { RegionService } from './region.service';

@Controller('region')
export class RegionController {

    constructor(private readonly regionService:RegionService){}

    @Auth()
    @Get()
    async findAll(){
        return await this.regionService.findAll()
    }

    @Auth()
    @Get(':id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.regionService.findById(id)
    }

    @Auth()
    @Post()
    async CreateOne(
        @Body() dto:CreateRegionDto
    ){
        return await this.regionService.createOne(dto)
    }

    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe)id:number,
        @Body() dto:EditRegionDto
    ){
        return await this.regionService.editOne(id,dto)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.regionService.deleteById(id)
    }
}
