import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ventas } from "./Ventas.entity";
import { Producto } from "./Producto.entity";

@Entity()
export class VentasProductos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ventaId: number;

  @Column()
  productoId: number;

  @Column()
  cantidadVenta: number;

  @ManyToOne(() => Ventas, (ventas) => ventas.ventasProductos)
  venta: Ventas;

  @ManyToOne(() => Producto, (producto) => producto.ventasProductos)
  producto: Producto;
}

