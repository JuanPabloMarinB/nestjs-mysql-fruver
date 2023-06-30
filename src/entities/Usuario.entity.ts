import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Rol } from '../enums/Rol';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column('enum', { enum: Rol, default: Rol.USER })
  rol: Rol;

  @Column()
  fechaAlta: Date;

  @Column()
  activo: boolean;

  getRol(): Rol {
    return this.rol;
  }
}