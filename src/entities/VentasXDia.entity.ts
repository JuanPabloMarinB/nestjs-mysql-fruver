import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class VentasXDia {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  diaVenta: Date

  //Se refiere a la cantidad de ventas que se han hecho en la fecha. Esto no se ingresa desde una solicitud, es un valor calculado automáticamente.
  @Column()
  totalVentasRealizadas: number

  //Total acumulado de las ventas por fechas. Esto no se ingresa desde una solicitud, es un valor calculado automáticamente.
  @Column()
  TotalAcumulado: number

  //Fecha de cierre de caja. Cada día se hace un cierre de caja.
  @Column()
  fechaCierreCaja: Date

  //Las ganancias por cierre de caja (x dia). Esto no se ingresa desde una solicitud, es un valor calculado automáticamente.
  @Column()
  ganancia: number
}
