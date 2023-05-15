import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { AWS_PUBLIC_BUCKET_NAME } from 'src/config/constants';
import { Propagation, runOnTransactionRollback, Transactional } from 'typeorm-transactional-cls-hooked';
import { FilesService } from 'src/files/file.service';
import { Role } from 'src/app.roles';

export interface UserFindOne {
  id?: number;
  user?: string;
}

@Injectable()
export class UserService{

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly filesService:FilesService
  ) {}

  @Transactional()
  async create(createUserDto: CreateUserDto, userEntity:User) {
    const userExist = await this.userRepository.findOne({ user: createUserDto.user });
    if (userExist && !createUserDto.id) throw new BadRequestException('El nombre del usuario ya esta registrado.');
    createUserDto.empleado.sucursal = userEntity.empleado.sucursal; 
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);

    delete user.password;
    return user;
  }

  async findAll(user:User) {
    return await this.userRepository.find({relations: ["empleado", "empleado.foto"], 
      where: {
        empleado: 
          {
            sucursal: {id:user.empleado.sucursal.id}
          }
      },
      order: {
        createdAt: "ASC"
      }
    });
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
<<<<<<< HEAD
      .findOne(id, {relations: ["empleado", "empleado.sucursal","empleado.sucursal.region"]});
=======
      .findOne(id, {relations: ["empleado", "empleado.sucursal", "empleado.foto"]});
>>>>>>> 3e93f6973e995cceaf378b6e1d9d368b19f01cee

    if (!user)
      throw new NotFoundException('User does not exists or unauthorized');

      //console.log(user.empleado.sucursal)
      //Object.keys(user.empleado.sucursal.region)
      //console.log(typeof(user.empleado.sucursal))
      //console.log(user.empleado.sucursal)
    return user;
  }
  
  async userName(userName: string) {
    const userResutl = await this.userRepository
      .findOne({where: 
          {user: userName}
        });
    return userResutl;
  }

  async userEmail(userEmail: string) {
    const userResutl = await this.userRepository
      .findOne({
        relations: ["empleado"],
        where: 
          {empleado: {
            email: userEmail
          }}
        });
    return userResutl;    
  }

  @Transactional()
  async uploadFile(dataBuffer: Buffer, filename: string, user:User, id:number) {    
    const usuario = await this.userRepository.findOne({
      relations: ['empleado', 'empleado.foto'],
      where: {id}
    })
    if(usuario.empleado.foto){
      const idArchivo = usuario.empleado.foto.id;
      usuario.empleado.foto = null;            
      await this.userRepository.save(usuario);
      await this.filesService.deletePublicFile(idArchivo);
    }
    const uploadResult = await this.filesService.uploadPublicFile(dataBuffer, filename, `${user.empleado.sucursal.nombre}-${usuario.empleado.nombre}-${usuario.empleado.apellido}`);
    usuario.empleado.foto = uploadResult;
    await this.userRepository.save(usuario);
    return uploadResult;
  }

  async findAdmins(){
    return await this.userRepository.createQueryBuilder("user")
      .innerJoin ("user.empleado", "empleado")
      .leftJoinAndSelect("empleado.sucursal", "sucursal")
      .leftJoinAndSelect("sucursal.foto", "fotoSucursal")
      .leftJoinAndSelect("empleado.foto", "foto")
      .select(["empleado", "user", "foto", "sucursal", "fotoSucursal"])      
      .where("user.roles @> ARRAY[:...roles]", {roles:[Role.ADMIN]})
      .orderBy("user.createdAt", "ASC")
      .getMany();
  
  }

  @Transactional()
  async createAdmins(createUserDto: CreateUserDto, foto:Express.Multer.File){
    const {empleado} = createUserDto
    const userExist = await this.userRepository.findOne({ user: createUserDto.user });
    if (userExist && !createUserDto.id) throw new BadRequestException('El nombre del usuario ya esta registrado.');
    const uploadResult = await this.filesService.uploadPublicFile(foto.buffer, foto.originalname, `${empleado.nombre}-${empleado.apellido}-admin`); 
    createUserDto.empleado.foto = uploadResult;
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    delete user.password;
    return user;    
  }

  @Transactional()
  async updateAdmins(updateUserDto: UpdateUserDto, foto:Express.Multer.File){
    const {empleado} = updateUserDto;
    const usuario = await this.userRepository.findOne({
        relations: ['empleado', 'empleado.foto'],
        where: {id: Number(updateUserDto.id)}
    })    
    if(usuario.empleado.foto){
      console.log('elimino la foto');
      
      const idArchivo = usuario.empleado.foto.id;
      usuario.empleado.foto = null;            
      await this.userRepository.save(usuario);
      await this.filesService.deletePublicFile(idArchivo);
    }
    if(foto){
      console.log('subio la foto');      
      const uploadResult = await this.filesService.uploadPublicFile(foto.buffer, foto.originalname, `${empleado.nombre}-${empleado.apellido}-admin`);
      updateUserDto.empleado.foto=uploadResult;
    }
    const updatedUser = Object.assign(usuario, updateUserDto);
    updatedUser.id = Number(updateUserDto.id)
    updatedUser.empleado.id = Number(updateUserDto.empleado.id)
    updatedUser.empleado.sucursal.id = Number(updateUserDto.empleado.sucursal.id)
    const updateUser = this.userRepository.create(updatedUser);
    const user = await this.userRepository.save(updateUser);
    delete user.password;
    return user;    
  }
}
