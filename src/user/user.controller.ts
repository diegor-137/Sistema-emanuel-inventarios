import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Recurso } from 'src/app.roles';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PermissionsRequired } from 'src/auth/decorators/permissions.decorator';
import Permission from 'src/auth/enums/permission.type';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @User() userEntity: UserEntity) {
    const data = await this.userService.create(createUserDto, userEntity, );
    return { message: 'Usuario registrado.', data };
  }

  @Auth()
  /* @PermissionsRequired(Permission.LeerUsuarios) */
  @Get()
  findAll(@User() userEntity: UserEntity) {
    return this.userService.findAll(userEntity);
  }

  @Get('usuario')
  usuario() {
    return this.userService.usuario();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.userService.getOne(id);
    return { data };
  }

  @Auth()
  @Get("name/:user")
  async userName(@Param("user") user: string) {
    return await this.userService.userName(user);
  }

  @Auth()
  @Get("email/:email")
  async userEmail(@Param("email") email: string) {
    return await this.userService.userEmail(email);
  }

  @Auth()
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity, @Param('id') id: number){
    return await this.userService.uploadFile(file.buffer, file.originalname, user, +id)
  }

  /* SUPER ADMIN */
  
  @Get('find/admins')
  findAdmins() {
    return this.userService.findAdmins();
  }

  @Auth()
  @Post('create/admins')
  @UseInterceptors(FileInterceptor('fotoSend'))
  async createAdmins(@UploadedFile() fotoSend: Express.Multer.File, @Body() createUserDto: CreateUserDto) {    
    const data = await this.userService.createAdmins(createUserDto, fotoSend);
    return { message: 'Admin registrado.', data };
  }

  @Auth()
  @Put('update/admins')
  @UseInterceptors(FileInterceptor('fotoSend'))
  async updateAdmins(@UploadedFile() fotoSend: Express.Multer.File, @Body() createUserDto: CreateUserDto) { 
    const data = await this.userService.updateAdmins(createUserDto, fotoSend);
    return { message: 'Admin registrado.', data };
  }
}
