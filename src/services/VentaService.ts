import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { log } from 'console'
import { Producto } from 'src/entities/Producto.entity'
import { Ventas } from 'src/entities/Ventas.entity'
import { VentasXDia } from 'src/entities/VentasXDia.entity'
import { Medida } from 'src/enums/Medida'
import { Between, Repository } from 'typeorm'

@Injectable()
export class VentasService {
  constructor (
    @InjectRepository(Ventas) private ventasRepository: Repository<Ventas>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(VentasXDia)
    private ventasXdiaRepository: Repository<VentasXDia>,
  ) {}

  async getVentaDia (diaVenta?: Date) {
    let fechaVenta: Date
    if (!diaVenta) {
      fechaVenta = new Date()
    } else {
      fechaVenta = new Date(
        diaVenta.getFullYear(),
        diaVenta.getMonth(),
        diaVenta.getDate(),
      )
    }

    console.log(fechaVenta)
    console.log(diaVenta)
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
    })

    let ventas: Ventas[]
    let acumulado: number = 0
    let gananciaTotal: number = 0
    /*let costo: number = 0
    let cantidadVenta: number[]*/

    if (ventaDia) {
      //Si ya hay un dia se utilizará el método update para actualizar los valores
      console.log('Entre al primer IF')
      console.log(ventaDia)

      ventas = await this.getVentaFecha(fechaVenta)

      for (let i = 0; i < ventas.length; i++) {
        acumulado += ventas[i].totalAPagar
        gananciaTotal += ventas[i].gananciaXventa
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
      ventaDia.diaVenta = fechaVenta
      ventaDia.totalVentasRealizadas = ventas.length
      ventaDia.TotalAcumulado = acumulado
      ventaDia.ganancia = gananciaTotal
      //ventaDia.ganancia = ganancia
      const cierreCaja = new Date(
        fechaVenta.getFullYear(),
        fechaVenta.getMonth(),
        fechaVenta.getDate(),
        23,
        59,
        59,
      )
      ventaDia.fechaCierreCaja = cierreCaja
      console.log(ventaDia)

      return await this.ventasXdiaRepository.update(
        { id: ventaDia.id },
        ventaDia,
      )
    } else {
      console.log('Estoy en el segundo IF')

      const nuevoVentaDia = new VentasXDia()
      ventas = await this.getVentaFecha(diaVenta)
      for (let i = 0; i < ventas.length; i++) {
        acumulado += ventas[i].totalAPagar
        gananciaTotal += ventas[i].gananciaXventa //Agregado!!!
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
      nuevoVentaDia.diaVenta = fechaVenta
      nuevoVentaDia.totalVentasRealizadas = ventas.length
      nuevoVentaDia.TotalAcumulado = acumulado
      nuevoVentaDia.ganancia = gananciaTotal //Agregado!!!
      //nuevoVentaDia.ganancia = ganancia
      const cierreCaja = new Date(
        fechaVenta.getFullYear(),
        fechaVenta.getMonth(),
        fechaVenta.getDate(),
        23,
        59,
        59,
      )
      nuevoVentaDia.fechaCierreCaja = cierreCaja
      console.log(nuevoVentaDia)

      return await this.ventasXdiaRepository.save(nuevoVentaDia)
    }
  }

  async registrarVenta (
    venta: {
      productos: {
        nombre: string
        codigoBarra: number
        costoXunidad: number //Agregado!!!
      }[]
      efectivo: number
    },
    cantidadVenta: number[],
  ) {
    console.log('La línea de abajo es del servicio. Soy de la línea 79')
    console.log(venta.productos, venta.efectivo, cantidadVenta)

    const nuevaVenta = new Ventas()
    nuevaVenta.productos = []
    nuevaVenta.totalAPagar = 0 // Asegúrate de inicializar el totalAPagar a 0.
    nuevaVenta.gananciaXventa = 0 //Agregado!!!
    console.log(venta.productos.length)

    for (let i = 0; i < venta.productos.length; i++) {
      console.log(i)
      const productoEncontrado = await this.productoRepository.findOne({
        where: {
          nombre: venta.productos[i].nombre,
          codigoBarra: venta.productos[i].codigoBarra,
        },
      })
      //Verificar la existencia de producto
      if (productoEncontrado) {
        console.log('Soy la línea 93')
        console.log(productoEncontrado)
        //Verificar la medida del producto.
        if (productoEncontrado.medida === Medida.UNIDAD) {
          //Verificar la disponibilidad de stock.
          if (cantidadVenta[i] <= productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i]
            console.log(totalPrecioProductos)
            nuevaVenta.totalAPagar += totalPrecioProductos
            console.log('Soy la línea 101')
            console.log(nuevaVenta.totalAPagar)

            //console.log('Soy la línea 106');
            //console.log(productos);

            const gananciaXproducto = //Agregado!!!
              totalPrecioProductos -
              productoEncontrado.costoXunidad * cantidadVenta[i]
            console.log('Soy la gananciaXproducto: ' + gananciaXproducto)
            nuevaVenta.gananciaXventa += gananciaXproducto //Agregado!!!
            console.log('Soy la ganancia total: ' + nuevaVenta.gananciaXventa)

            nuevaVenta.productos.push(productoEncontrado)
            console.log('Producto registrado en venta')
          } else {
            return new HttpException(
              'La cantidad de productos a vender supera el stock disponible',
              HttpStatus.CONFLICT,
            )
          }
        } else if (productoEncontrado.medida === Medida.PESO) {
          if (cantidadVenta[i] < productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i]
            nuevaVenta.totalAPagar += totalPrecioProductos
            /*productoEncontrado.cantidadActual -= cantidadVenta[i]
            await this.productoRepository.update(
              productoEncontrado.id,
              productoEncontrado,
            )*/
            nuevaVenta.productos.push(productoEncontrado)
            console.log('Producto registrado en venta')
          } else {
            return new HttpException(
              'La cantidad de productos a vender supera el stock disponible',
              HttpStatus.CONFLICT,
            )
          }
        }
      } else {
        console.log('Este producto no esta registrado en el inventario')
      }
      productoEncontrado.cantidadActual -= cantidadVenta[i]
      console.log('Soy la línea 104')
      console.log(productoEncontrado.cantidadActual)
      await this.productoRepository.update(
        productoEncontrado.id,
        productoEncontrado,
      )
    }
    const ventaFactura =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

    nuevaVenta.ventaFactura = ventaFactura
    nuevaVenta.efectivo = venta.efectivo
    nuevaVenta.cambio = venta.efectivo - nuevaVenta.totalAPagar
    nuevaVenta.cantidadVenta = JSON.stringify(cantidadVenta)
    return await this.ventasRepository.save(nuevaVenta)
  }

  getVentas () {
    return this.ventasRepository.find({
      relations: ['productos'],
    })
  }

  async getVentaId (id: number) {
    const ventaEncontrada = await this.ventasRepository.findOne({
      where: {
        id,
      },
      relations: ['productos'],
    })

    if (!ventaEncontrada) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return ventaEncontrada
  }

  async getVentaFecha (fecha: Date): Promise<Ventas[]> {
    const startOfDay = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    )
    const endOfDay = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      23,
      59,
      59,
      999,
    )
    const ventasEncontradas = await this.ventasRepository.find({
      where: {
        fechaVenta: Between(startOfDay, endOfDay),
      },
      relations: ['productos'],
    })

    return ventasEncontradas
  }
}
