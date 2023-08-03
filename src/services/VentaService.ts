import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/entities/Producto.entity';
import { Ventas } from 'src/entities/Ventas.entity';
import { VentasProductos } from 'src/entities/VentasProductos.entity';
import { VentasXDia } from 'src/entities/VentasXDia.entity';
import { Medida } from 'src/enums/Medida';
import { MetodoPago } from 'src/enums/MetodoPago';
import { Between, Repository } from 'typeorm';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Ventas) private ventasRepository: Repository<Ventas>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(VentasXDia)
    private ventasXdiaRepository: Repository<VentasXDia>,
  ) {}

  async getVentaDia(diaVenta?: Date) {
    let fechaVenta: Date;
    if (!diaVenta) {
      fechaVenta = new Date();
    } else {
      fechaVenta = new Date(
        diaVenta.getFullYear(),
        diaVenta.getMonth(),
        diaVenta.getDate(),
      );
    }

    console.log(fechaVenta);
    console.log(diaVenta);
    const ventaDia = await this.ventasXdiaRepository.findOne({
      where: {
        diaVenta: Between(
          fechaVenta,
          new Date(
            fechaVenta.getFullYear(),
            fechaVenta.getMonth(),
            fechaVenta.getDate(),
            23,
            59,
            59,
          ),
        ),
      },
    });

    let ventas: Ventas[];
    let acumulado: number = 0;
    let gananciaTotal: number = 0;
    /*let costo: number = 0
    let cantidadVenta: number[]*/

    if (ventaDia) {
      //Si ya hay un dia se utilizará el método update para actualizar los valores
      console.log('Entre al primer IF');
      console.log(ventaDia);

      ventas = await this.getVentaFecha(fechaVenta);

      for (let i = 0; i < ventas.length; i++) {
        acumulado += ventas[i].totalAPagar;
        gananciaTotal += ventas[i].gananciaXventa;
        /*cantidadVenta = ventas[i].cantidadVenta
        const cadenaLimpia = ventas[i].cantidadVenta.slice(1, -1)
        const valores = cadenaLimpia.split(',')
        cantidadVenta = valores.map(valor => parseInt(valor))
        console.log('Yo soy cantidadVenta: ' + cantidadVenta)

        for (let j = 0; j < ventas[i].productos.length; j++) {
          costo += ventas[i].productos[j].costoXunidad 
        }
        ganancia = acumulado - costo*/
      }
      ventaDia.diaVenta = fechaVenta;
      ventaDia.totalVentasRealizadas = ventas.length;
      ventaDia.TotalAcumulado = acumulado;
      ventaDia.ganancia = gananciaTotal;
      //ventaDia.ganancia = ganancia
      const cierreCaja = new Date(
        fechaVenta.getFullYear(),
        fechaVenta.getMonth(),
        fechaVenta.getDate(),
        23,
        59,
        59,
      );
      ventaDia.fechaCierreCaja = cierreCaja;
      console.log(ventaDia);

      await this.ventasXdiaRepository.update(
        { id: ventaDia.id },
        ventaDia,
      );

      return {
        resumen: ventaDia,
        ventas: ventas
      }
    } else {
      console.log('Estoy en el segundo IF');

      const nuevoVentaDia = new VentasXDia();
      ventas = await this.getVentaFecha(diaVenta);
      for (let i = 0; i < ventas.length; i++) {
        acumulado += ventas[i].totalAPagar;
        gananciaTotal += ventas[i].gananciaXventa; //Agregado!!!
        /*cantidadVenta = ventas[i].cantidadVenta
        const cadenaLimpia = ventas[i].cantidadVenta.slice(1, -1)
        const valores = cadenaLimpia.split(',')
        cantidadVenta = valores.map(valor => parseInt(valor))
        console.log(cantidadVenta)

        for (let j = 0; j < ventas[i].productos.length; j++) {
          costo += ventas[i].productos[j].costoXunidad * cantidadVenta[j]
        }
        ganancia = acumulado - costo*/
      }
      nuevoVentaDia.diaVenta = fechaVenta;
      nuevoVentaDia.totalVentasRealizadas = ventas.length;
      nuevoVentaDia.TotalAcumulado = acumulado;
      nuevoVentaDia.ganancia = gananciaTotal; //Agregado!!!
      //nuevoVentaDia.ganancia = ganancia
      const cierreCaja = new Date(
        fechaVenta.getFullYear(),
        fechaVenta.getMonth(),
        fechaVenta.getDate(),
        23,
        59,
        59,
      );
      nuevoVentaDia.fechaCierreCaja = cierreCaja;
      console.log(nuevoVentaDia);

      await this.ventasXdiaRepository.save(nuevoVentaDia);
      return {
        resumen: nuevoVentaDia,
        ventas: ventas
      }
    }
  }

  async registrarVenta(
    productos: {
      nombre: string;
      codigoBarra: number;
    }[],
    efectivo: number,
    cantidadVenta: number[],
    metodoPago: MetodoPago,
  ) {
    const nuevaVenta = new Ventas();
    nuevaVenta.ventasProductos = [];
    nuevaVenta.totalAPagar = 0;
    nuevaVenta.gananciaXventa = 0;
    nuevaVenta.metodoPago = metodoPago; //Agregado

    for (let i = 0; i < productos.length; i++) {
      console.log(i);
      const productoEncontrado = await this.productoRepository.findOne({
        where: {
          nombre: productos[i].nombre,
          codigoBarra: productos[i].codigoBarra,
        },
      });
      //Verificar la existencia de producto
      if (productoEncontrado) {
        console.log('Soy la línea 93');
        console.log(productoEncontrado);
        //Verificar la medida del producto.
        if (productoEncontrado.medida === Medida.UNIDAD) {
          //Verificar la disponibilidad de stock.
          if (cantidadVenta[i] <= productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i];
            nuevaVenta.totalAPagar += totalPrecioProductos;

            const gananciaXproducto = //Agregado!!!
              totalPrecioProductos -
              productoEncontrado.costoXunidad * cantidadVenta[i];
            console.log('Soy la gananciaXproducto: ' + gananciaXproducto);
            nuevaVenta.gananciaXventa += gananciaXproducto; //Agregado!!!
            console.log('Soy la ganancia total: ' + nuevaVenta.gananciaXventa);

            const ventasProductos = new VentasProductos();
            ventasProductos.venta = nuevaVenta;
            ventasProductos.producto = productoEncontrado;
            ventasProductos.cantidadVenta = cantidadVenta[i];
            nuevaVenta.ventasProductos.push(ventasProductos);
            console.log('Producto registrado en venta');
          } else {
            return new HttpException(
              'La cantidad de productos a vender supera el stock disponible',
              HttpStatus.CONFLICT,
            );
          }
        } else if (productoEncontrado.medida === Medida.PESO) {
          if (cantidadVenta[i] < productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i];
            nuevaVenta.totalAPagar += totalPrecioProductos;
            /*productoEncontrado.cantidadActual -= cantidadVenta[i]
            await this.productoRepository.update(
              productoEncontrado.id,
              productoEncontrado,
            )*/
            const gananciaXproducto = //Agregado!!!
              totalPrecioProductos -
              productoEncontrado.costoXunidad * cantidadVenta[i]
            console.log('Soy la gananciaXproducto: ' + gananciaXproducto)
            nuevaVenta.gananciaXventa += gananciaXproducto //Agregado!!!
            console.log('Soy la ganancia total: ' + nuevaVenta.gananciaXventa)
            const ventasProductos = new VentasProductos();
            ventasProductos.venta = nuevaVenta;
            ventasProductos.producto = productoEncontrado;
            ventasProductos.cantidadVenta = cantidadVenta[i];
            nuevaVenta.ventasProductos.push(ventasProductos);
            console.log('Producto registrado en venta');
          } else {
            return new HttpException(
              'La cantidad de productos a vender supera el stock disponible',
              HttpStatus.CONFLICT,
            );
          }
        }
      } else {
        console.log('Este producto no esta registrado en el inventario');
      }
      productoEncontrado.cantidadActual -= cantidadVenta[i];
      console.log('Soy la línea 104');
      console.log(productoEncontrado.cantidadActual);
      await this.productoRepository.update(
        productoEncontrado.id,
        productoEncontrado,
      );
    }
    const ventaFactura =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    nuevaVenta.ventaFactura = ventaFactura;
    nuevaVenta.efectivo = efectivo;
    nuevaVenta.cambio = efectivo - nuevaVenta.totalAPagar;

    return await this.ventasRepository.save(nuevaVenta);
  }

  getVentas() {
    return this.ventasRepository.find({
      relations: ['ventasProductos', 'ventasProductos.producto'],
    });
  }

  async getVentaId(id: number) {
    const ventaEncontrada = await this.ventasRepository.findOne({
      where: {
        id,
      },
      relations: ['productos'],
    });

    if (!ventaEncontrada) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return ventaEncontrada;
  }

  async getVentaFecha(fecha: Date): Promise<Ventas[]> {
    const startOfDay = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    );
    const endOfDay = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      23,
      59,
      59,
      999,
    );
    const ventasEncontradas = await this.ventasRepository.find({
      where: {
        fechaVenta: Between(startOfDay, endOfDay),
      },
      relations: ['ventasProductos', 'ventasProductos.producto'],
    });

    return ventasEncontradas;
  }
}
