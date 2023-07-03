import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Categoria } from './Categoria.entity';
import { Ventas } from './Ventas.entity';
import { Medida } from '../enums/Medida';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: false, default: 1566 })
  codigoBarra: number;

  @Column({default: "arroz chino"})
  nombre: string;

  @Column({ type: 'enum', enum: Medida, default: Medida.UNIDAD })
  medida: Medida;

  @Column({default: 1500})
  costoXunidad: number;

  @Column({default: 0})
  precioVenta: number;

  @Column({default: "23-06-2022"})
  fechaIngreso: string;

  @Column()
  cantidadIngresada: number;

  @Column({default: 0})
  cantidadActual: number;

  @Column({default: false})
  avisoReposicion: boolean;

  @Column('longblob', { nullable: true })
  imagen: Buffer;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn()
  categoria: Categoria;

  @ManyToMany(() => Ventas, (ventas) => ventas.productos)
  ventas: Ventas;

  @Column({default: true})
  activo: boolean;
}
