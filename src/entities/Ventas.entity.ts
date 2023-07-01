import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Producto } from './Producto.entity';

@Entity()
export class Ventas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ventaRealizada: number;

  @Column()
  cantidadVendida: number;

  @Column()
  fechaVenta: Date;

  @Column()
  totalVentasRealizadas: number;

  @Column()
  TotalAcumulado: number;

  @Column()
  fechaCierreCaja: Date;

  @Column()
  ganancia: number;

  @OneToMany(() => Producto, (producto) => producto.ventas)
  productos: Producto[];
  
}
