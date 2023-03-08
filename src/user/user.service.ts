import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export interface UserFindOne {
  id?: number;
  user?: string;
}

@Injectable()
export class UserService{

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({ user: createUserDto.user });
    if (userExist) throw new BadRequestException('El nombre del usuario ya esta registrado.')
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);

    delete user.password;
    return user;
  }

  async findAll() {
    return await this.userRepository.find({relations: ["empleado"]});
  }

  async usuario() {
    return await this.userRepository.createQueryBuilder('user')
    .where("user.roles @> ARRAY[:...roles]", {roles: ['CAJERO']})
    .getMany();
  }

  async findOne(data: UserFindOne) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.password')
      //.leftJoinAndSelect('user.empleado', 'empleado')
      .getOne();
  }

  async getOne(id: number) {

    const users = await getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.empleado","empleado")
    .leftJoinAndSelect("empleado.sucursal","sucursal")
    .leftJoinAndSelect("sucursal.region","region")
    .getOne()
    const user = await this.userRepository
      .findOne(id, {relations: ["empleado", "empleado.sucursal","empleado.sucursal.region"]});

    if (!user)
      throw new NotFoundException('User does not exists or unauthorized');

      //console.log(user.empleado.sucursal)
      //Object.keys(user.empleado.sucursal.region)
      //console.log(typeof(user.empleado.sucursal))
      //console.log(user.empleado.sucursal)
    return user;
  } 
  /* PENDIENTE */
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /* PENDIENTE */
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
