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
import { Categoria } from 'src/entities/Categoria.entity';

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
    console.log("Soy el servicio");
    console.log(producto)
    //producto.cantidadActual = 0;
    producto.cantidadActual = (producto.cantidadActual ?? 0) + producto.cantidadIngresada;
    return this.productoRepository.save(producto);
  }

  async delete(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }

  async save(producto: Producto): Promise<Producto> {
    return this.productoRepository.save(producto);
  }
  //@UseInterceptors(FileInterceptor('imagen'))
  async registrar(
    nombre: string,
    medida: Medida,
    costoXunidad: number,
    cantidadIngresada: number,
    codigoBarra: number,
    precioVenta: number,
    categoria: Categoria,
    //@UploadedFile() imagen: Express.Multer.File,
  ): Promise<void> {
    
    this.validar(
      nombre,
      medida,
      costoXunidad,
      cantidadIngresada,
      codigoBarra,
      precioVenta,
      categoria,
      //imagen.buffer,
    );

    const producto = new Producto();
    producto.nombre = nombre;
    producto.medida = medida;
    producto.costoXunidad = costoXunidad;
    producto.cantidadIngresada = cantidadIngresada;
    producto.codigoBarra = codigoBarra;
    producto.precioVenta = precioVenta;
    producto.categoria = categoria;
    producto.cantidadActual += producto.cantidadIngresada;
    //producto.fechaInventario = fechaInventario;
    //producto.imagen = imagen.buffer;

    await this.productoRepository.save(producto);
  }

  private validar(
    nombre: string,
    medida: Medida,
    costoXunidad: number,
    cantidadIngresada: number,
    codigoBarra: number,
    precioVenta: number,
    categoria: Categoria,
    //imagen: Buffer,
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
    /*FileInterceptor('imagen', {
      fileFilter: (req, imagen, callback) => {
        if (!imagen.originalname.match(/.(png)$/)) {
          return callback(new Error('Solo se permiten archivos PNG'), false);
        }
        if (imagen.size > 500 * 1024) {
          return callback(new Error('El tamaño máximo del archivo es de 500 KB'), false);
        }
        callback(null, true);
      },
    })*/
  
  }

  async mostrarInventario(): Promise<void> {
    const inventario = await this.productoRepository.find();
    console.log('***** Inventario *****');
    inventario.forEach((producto) => {
      const medida = producto.medida === Medida.UNIDAD ? 'unidades' : 'kilos';
      console.log(`${producto.nombre}: ${producto.cantidadActual} ${medida}`);
    });
    console.log();
  }
}
