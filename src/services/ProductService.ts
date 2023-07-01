import { Injectable, UploadedFile, UseInterceptors} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/Producto.entity';
import { NombreInvalidoException } from '../exceptions/product/NombreInvalidoException';
import { PrecioInvalidoException } from '../exceptions/product/PrecioInvalidoException';
import { CantidadInvalidoException } from '../exceptions/product/CantidadInvalidoException';
import { FechaInvalidoException } from '../exceptions/product/FechaInvalidoException';
import { Medida } from '../enums/Medida';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('imagen'))
  async registrar(
    nombre: string,
    //medida: Medida,
    costoXunidad: number,
    cantidadIngresada: number,
    fechaInventario: string,
    @UploadedFile() imagen: Express.Multer.File,
  ): Promise<void> {
    this.validar(
      nombre,
      //medida,
      costoXunidad,
      cantidadIngresada,
      fechaInventario,
      imagen.buffer,
    );

    const producto = new Producto();
    producto.nombre = nombre;
    //producto.medida = medida;
    producto.costoXunidad = costoXunidad;
    producto.cantidadVenta = cantidadIngresada;
    producto.fechaInventario = fechaInventario;
    producto.imagen = imagen.buffer;

    await this.productoRepository.save(producto);
  }

  private validar(
    nombre: string,
    //medida: Medida,
    costoXunidad: number,
    cantidadIngresada: number,
    fechaInventario: string,
    imagen: Buffer,
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
    FileInterceptor('imagen', {
      fileFilter: (req, imagen, callback) => {
        if (!imagen.originalname.match(/.(png)$/)) {
          return callback(new Error('Solo se permiten archivos PNG'), false);
        }
        if (imagen.size > 500 * 1024) {
          return callback(new Error('El tamaño máximo del archivo es de 500 KB'), false);
        }
        callback(null, true);
      },
    })
  
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
