import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { VentasProductos } from './VentasProductos.entity'
import { MetodoPago } from 'src/enums/MetodoPago'

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

  @Column({ type: 'enum', enum: MetodoPago, default: MetodoPago.EFECTIVO})
  metodoPago: MetodoPago;

  /*
  constructor() {
    this.productos = [];
  }*/

  constructor () {
    this.totalAPagar = 0
  }
}
