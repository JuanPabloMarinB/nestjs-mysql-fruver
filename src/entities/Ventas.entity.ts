import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Producto } from './Producto.entity'
import { VentasProductos } from './VentasProductos.entity'

@Entity()
export class Ventas {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint', unique: true })
  ventaFactura: number

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaVenta: Date

  @OneToMany(() => VentasProductos, (ventasProductos) => ventasProductos.venta, {cascade:true})
  ventasProductos: VentasProductos[];

  @Column()
  totalAPagar: number

  @Column()
  efectivo: number

  @Column()
  cambio: number

  @Column()
  gananciaXventa: number //Agregado!!!
  /*
  constructor() {
    this.productos = [];
  }*/

  constructor () {
    this.totalAPagar = 0
  }
}
