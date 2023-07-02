import { EntityRepository, Repository } from 'typeorm';
import { Ventas } from '../entities/Ventas.entity';

@EntityRepository(Ventas)
export class ventasRepository extends Repository<Ventas> {
  async findByNombre(id: number): Promise<Ventas> {
    return this.findOne({ where: { id } });
  }
}