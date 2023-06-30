import { Repository, EntityRepository } from 'typeorm';
import { Usuario } from '../entities/Usuario.entity';

@EntityRepository(Usuario)
export class UserRepository extends Repository<Usuario> {
  findByEmail(email: string): Promise<Usuario> {
    return this.findOne({ where: { email } });
  }
}
