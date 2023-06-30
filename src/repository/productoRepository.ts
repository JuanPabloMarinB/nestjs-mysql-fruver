import { EntityRepository, Repository } from 'typeorm';
import { Producto } from '../entities/Producto.entity';

@EntityRepository(Producto)
export class productoRepository extends Repository<Producto> {
  async findByNombre(nombre: string): Promise<Producto> {
    return this.findOne({ where: { nombre } });
  }
}
