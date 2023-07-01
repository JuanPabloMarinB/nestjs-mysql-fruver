import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './Producto.entity';
import { CategoriaEnum } from '../enums/CategoriaEnum';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CategoriaEnum, default: CategoriaEnum.HORTALIZAS })
  nombreCategoria: Categoria;

  @OneToMany(() => Producto, producto => producto.categoria)
  productos: Producto[];
  
}