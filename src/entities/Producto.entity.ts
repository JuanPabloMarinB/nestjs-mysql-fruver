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
import { CategoriaEnum } from 'src/enums/CategoriaEnum';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: false})
  codigoBarra: number;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: Medida})
  medida: Medida;

  @Column()
  costoXunidad: number;

  @Column()
  precioVenta: number;

  @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
  fechaIngreso: Date;

  @Column()
  cantidadIngresada: number;

  @Column({nullable: true, default: 0})
  cantidadActual: number;

  @Column({default: false})
  avisoReposicion: boolean;

  /*@Column('longblob', { nullable: true })
  imagen: Buffer;*/

  @Column({ type: 'enum', enum: CategoriaEnum })
  categoria: Categoria;

  @ManyToMany(() => Ventas, (ventas) => ventas.productos)
  ventas: Ventas;

  @Column({default: true})
  activo: boolean
}
