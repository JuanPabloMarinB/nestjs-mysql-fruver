import { EntityRepository, Repository } from 'typeorm';
import { VentasXDia } from 'src/entities/VentasXDia.entity';

@EntityRepository(VentasXDia)
export class VentasXDiaRepository extends Repository<VentasXDia> {
  async findByNombre(id: number): Promise<VentasXDia> {
    return this.findOne({ where: { id } });
  }
}