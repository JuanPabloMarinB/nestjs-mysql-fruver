import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/Producto.entity';
import { NombreInvalidoException } from '../exceptions/product/NombreInvalidoException';
import { PrecioInvalidoException } from '../exceptions/product/PrecioInvalidoException';
import { CantidadInvalidoException } from '../exceptions/product/CantidadInvalidoException';
import { FechaInvalidoException } from '../exceptions/product/FechaInvalidoException';
import { stringify } from 'querystring';
import { Medida } from '../enums/Medida';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findById(id: number): Promise<Producto> {
    return this.productoRepository.findOne({ where: { id } });
  }

  async update(id: number, producto: Producto): Promise<void> {
    await this.productoRepository.update(id, producto);
  }

  async create(producto: Producto): Promise<Producto> {
    return this.productoRepository.save(producto);
  }

  async delete(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }

  async save(producto: Producto): Promise<Producto> {
    return this.productoRepository.save(producto);
  }

  async registrar(
    nombre: string,
    medida: Medida,
    costoXunidad: number,
    cantidadIngresada: number,
    fechaInventario: string,
  ): Promise<void> {
    this.validar(
      nombre,
      medida,
      costoXunidad,
      cantidadIngresada,
      fechaInventario,
    );

    const producto = new Producto();
    producto.nombre = nombre;
    producto.medida = medida;
    producto.costoXunidad = costoXunidad;
    producto.cantidadVenta = cantidadIngresada;
    producto.fechaInventario = fechaInventario;

    await this.productoRepository.save(producto);
  }

  private validar(
    nombre: string,
    medida: Medida,
    costoXunidad: number,
    cantidadIngresada: number,
    fechaInventario: string,
  ): void {
    if (!nombre || nombre.trim() === '') {
      throw new NombreInvalidoException();
    }
    if (isNaN(costoXunidad) || costoXunidad <= 0) {
      throw new PrecioInvalidoException();
    }
    if (isNaN(cantidadIngresada) || cantidadIngresada <= 0) {
      throw new CantidadInvalidoException();
    }
    if (
      !(fechaInventario.length == 10)
      //isNaN(stringify( fechaInventario.getTime()))
    ) {
      throw new FechaInvalidoException();
    }
  }

  async registrarVenta(
    producto: string,
    cantidadVenta: number,
    costoXunidad: number,
  ): Promise<void> {
    const productoExistente = await this.productoRepository.findOne({
      where: { nombre: producto },
    });

    if (productoExistente) {
      const cantidadDisponible = productoExistente.cantidadVenta;

      if (productoExistente.medida === Medida.UNIDAD) {
        if (cantidadVenta <= cantidadDisponible) {
          const precioVenta = costoXunidad * cantidadVenta;
          productoExistente.cantidadVenta = cantidadDisponible - cantidadVenta;
          await this.productoRepository.save(productoExistente);
          console.log(
            `Venta registrada correctamente. Precio de venta: $${precioVenta.toFixed(
              2,
            )}.`,
          );
        } else {
          console.log(
            'No hay suficiente cantidad de ' + producto + ' en el inventario.',
          );
        }
      } else if (productoExistente.medida === Medida.PESO) {
        if (cantidadVenta <= cantidadDisponible) {
          const precioVenta = costoXunidad * cantidadVenta;
          productoExistente.cantidadVenta = cantidadDisponible - cantidadVenta;
          await this.productoRepository.save(productoExistente);
          console.log(
            `Venta registrada correctamente. Precio de venta: $${precioVenta.toFixed(
              2,
            )}.`,
          );
        } else {
          console.log(
            'No hay suficiente cantidad de ' + producto + ' en el inventario.',
          );
        }
      }
    } else {
      console.log('Producto no encontrado en el inventario.');
    }
  }

  async mostrarInventario(): Promise<void> {
    const inventario = await this.productoRepository.find();
    console.log('***** Inventario *****');
    inventario.forEach((producto) => {
      const medida = producto.medida === Medida.UNIDAD ? 'unidades' : 'kilos';
      console.log(`${producto.nombre}: ${producto.cantidadVenta} ${medida}`);
    });
    console.log();
  }
}
