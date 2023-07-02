import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "src/entities/Producto.entity";
import { Ventas } from "src/entities/Ventas.entity";
import { Medida } from "src/enums/Medida";
import { Repository } from "typeorm";


@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Ventas) private ventasRepository: Repository<Ventas>,
        @InjectRepository(Producto) private productoRepository: Repository<Producto>){

    }
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
        //Pasar el array de productos de esta venta.
        productos: { 
            //Pasar los valores de los atributos necesarios para cargar el producto.
            nombre: string,
            codigoBarra: number,
        }[],
        //Atributos de tabla venta
        efectivoVenta: number,
        cantidadVenta: number[],
        ){  
            console.log("La línea de abajo es del servicio. Soy de la línea 79");
            console.log(productos, efectivoVenta, cantidadVenta);
            //Crear nueva venta y cargar sus atributos con el array de productos
            const nuevaVenta = new Ventas();
            nuevaVenta.productos = [];
            for (let i = 0; i < productos.length; i++){

                const productoEncontrado = await this.productoRepository.findOne({
                    where: { 
                        nombre: productos[i].nombre,
                        codigoBarra: productos[i].codigoBarra
                    },
                });
                //Verificar la existencia de producto
                if (productoEncontrado) {
                    console.log("Soy la línea 93");
                    console.log(productoEncontrado);
                    //Verificar la medida del producto.
                    if (productoEncontrado.medida === Medida.UNIDAD){
                        //Verificar la disponibilidad de stock.
                        if (cantidadVenta[0] < productoEncontrado.cantidadActual){
                            const totalPrecioProductos = productoEncontrado.precioVenta * cantidadVenta[0];
                            console.log(totalPrecioProductos);
                            nuevaVenta.totalAPagar += totalPrecioProductos;
                            console.log("Soy la línea 101");
                            console.log(nuevaVenta.totalAPagar);
                            productoEncontrado.cantidadActual -= cantidadVenta[0];
                            console.log("Soy la línea 104");
                            console.log(productoEncontrado.cantidadActual);
                            await this.productoRepository.update(productoEncontrado.id, productoEncontrado);
                            console.log("Soy la línea 106");
                            console.log(productos);
                            nuevaVenta.productos.push(productoEncontrado);
                            console.log("Producto registrado en venta");
                        }else {
                            console.log("La cantidad de productos a vender supera el stock disponible");
                        }
                    }else if (productoEncontrado.medida === Medida.PESO){
                        if (cantidadVenta[0] < productoEncontrado.cantidadActual){
                            const totalPrecioProductos = productoEncontrado.precioVenta * cantidadVenta[0];
                            nuevaVenta.totalAPagar += totalPrecioProductos;
                            productoEncontrado.cantidadActual -= cantidadVenta[0];
                            await this.productoRepository.update(productoEncontrado.id, productoEncontrado);
                            nuevaVenta.productos.push(productoEncontrado);
                            console.log("Producto registrado en venta");
                        }else {
                            console.log("La cantidad de productos a vender supera el stock disponible");
                        }
                    }
                } else {
                    console.log("Este producto no esta registrado en el inventario");
                }   

            const ventaFactura = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            

            nuevaVenta.ventaFactura = ventaFactura;
            nuevaVenta.efectivo = efectivoVenta;
            nuevaVenta.cambio = efectivoVenta - nuevaVenta.totalAPagar;
            return await this.ventasRepository.save(nuevaVenta);
        }
    }

    getVentas() {
        return this.ventasRepository.find({
            relations: ['productos']
        })
    }

    async getVentaId(id: number) {
        const ventaEncontrada = await this.ventasRepository.findOne({
            where: {
                id
            },
            relations: ['productos']
        })

        if (!ventaEncontrada) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        return ventaEncontrada;
    }
    
}
