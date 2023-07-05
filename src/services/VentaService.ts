import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Producto } from 'src/entities/Producto.entity';
import { Ventas } from 'src/entities/Ventas.entity';
import { Medida } from 'src/enums/Medida';
import { Repository } from 'typeorm';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Ventas) private ventasRepository: Repository<Ventas>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}
  /*
    async registrarVentas(
        nombreProducto: string,
        codigoBarraProducto: number,
        cantidadVenta: number,
        costoXunidad: number,
      ): Promise<void> {
        const productoExistente = await this.productoRepository.findOne({
          where: { 
            nombre: nombreProducto,
            codigoBarra: codigoBarraProducto},
        });
    
        if (productoExistente) {
          const cantidadDisponible = productoExistente.cantidadActual;
    
          if (productoExistente.medida === Medida.UNIDAD) {
            if (cantidadVenta <= cantidadDisponible) {
              const precioVenta = costoXunidad * cantidadVenta;
              productoExistente.cantidadActual = cantidadDisponible - cantidadVenta;
              await this.productoRepository.save(productoExistente);
              console.log(
                `Venta registrada correctamente. Precio de venta: $${precioVenta.toFixed(
                  2,
                )}.`,
              );
            } else {
              console.log(
                'No hay suficiente cantidad de ' + nombreProducto + ' en el inventario.',
              );
            }
          } else if (productoExistente.medida === Medida.PESO) {
            if (cantidadVenta <= cantidadDisponible) {
              const precioVenta = costoXunidad * cantidadVenta;
              productoExistente.cantidadActual = cantidadDisponible - cantidadVenta;
              await this.productoRepository.save(productoExistente);
              console.log(
                `Venta registrada correctamente. Precio de venta: $${precioVenta.toFixed(
                  2,
                )}.`,
              );
            } else {
              console.log(
                'No hay suficiente cantidad de ' + nombreProducto + ' en el inventario.',
              );
            }
          }
        } else {
          console.log('Producto no encontrado en el inventario.');
        }
    }*/

  async registrarVenta(
    venta: {
      productos: {
        nombre: string;
        codigoBarra: number;
      }[];
      efectivo: number;
    },
    cantidadVenta: number[],
  ) {
    console.log('La línea de abajo es del servicio. Soy de la línea 79');
    console.log(venta.productos, venta.efectivo, cantidadVenta);

    const nuevaVenta = new Ventas();
    nuevaVenta.productos = [];
    nuevaVenta.totalAPagar = 0; // Asegúrate de inicializar el totalAPagar a 0.
    console.log(venta.productos.length);
    
    
    for (let i = 0; i < venta.productos.length; i++) {
      console.log(i);
      const productoEncontrado = await this.productoRepository.findOne({
        where: {
          nombre: venta.productos[i].nombre,
          codigoBarra: venta.productos[i].codigoBarra,
        },
      });
      //Verificar la existencia de producto
      if (productoEncontrado) {
        console.log('Soy la línea 93');
        console.log(productoEncontrado);
        //Verificar la medida del producto.
        if (productoEncontrado.medida === Medida.UNIDAD) {
          //Verificar la disponibilidad de stock.
          if (cantidadVenta[i] < productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i];
            console.log(totalPrecioProductos);
            nuevaVenta.totalAPagar += totalPrecioProductos;
            console.log('Soy la línea 101');
            console.log(nuevaVenta.totalAPagar);
            productoEncontrado.cantidadActual -= cantidadVenta[i];
            console.log('Soy la línea 104');
            console.log(productoEncontrado.cantidadActual);
            await this.productoRepository.update(
              productoEncontrado.id,
              productoEncontrado,
            );
            //console.log('Soy la línea 106');
            //console.log(productos);
            nuevaVenta.productos.push(productoEncontrado);
            console.log('Producto registrado en venta');
          } else {
            console.log(
              'La cantidad de productos a vender supera el stock disponible',
            );
          }
        } else if (productoEncontrado.medida === Medida.PESO) {
          if (cantidadVenta[i] < productoEncontrado.cantidadActual) {
            const totalPrecioProductos =
              productoEncontrado.precioVenta * cantidadVenta[i];
            nuevaVenta.totalAPagar += totalPrecioProductos;
            productoEncontrado.cantidadActual -= cantidadVenta[i];
            await this.productoRepository.update(
              productoEncontrado.id,
              productoEncontrado,
            );
            nuevaVenta.productos.push(productoEncontrado);
            console.log('Producto registrado en venta');
          } else {
            console.log(
              'La cantidad de productos a vender supera el stock disponible',
            );
          }
        }
      } else {
        console.log('Este producto no esta registrado en el inventario');
      }
    }
    const ventaFactura =
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

      nuevaVenta.ventaFactura = ventaFactura;
      nuevaVenta.efectivo = venta.efectivo;
      nuevaVenta.cambio = venta.efectivo - nuevaVenta.totalAPagar;
      return await this.ventasRepository.save(nuevaVenta);
  }

  getVentas() {
    return this.ventasRepository.find({
      relations: ['productos'],
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
}
