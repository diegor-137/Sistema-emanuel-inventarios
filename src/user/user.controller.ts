import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Recurso } from 'src/app.roles';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PermissionsRequired } from 'src/auth/decorators/permissions.decorator';
import Permission from 'src/auth/enums/permission.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    return { message: 'Usuario registrado.', data };
  }

  @Auth()
  /* @PermissionsRequired(Permission.LeerUsuarios) */
  @Get()
  findAll() {
    return this.userService.findAll();
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

  /* PENDIENTE */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  /* PENDIENTE */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
