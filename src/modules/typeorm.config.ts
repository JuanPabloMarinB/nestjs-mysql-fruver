import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Producto } from 'src/entities/Producto.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'inventario',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
