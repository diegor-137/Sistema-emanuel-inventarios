import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PartialType } from "@nestjs/mapped-types";
import { OmitType } from "@nestjs/swagger";

@Entity('alumnos')
export class Alumno {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    apellido: string;

    @Column()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    role: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
    createdAt: Date;

}

export class AlumnoEdit extends PartialType(
    OmitType(Alumno, ['role'] as const)
    ){

} 