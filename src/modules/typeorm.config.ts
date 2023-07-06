import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'inventario-fruver.ctjpcrngdxjd.us-east-2.rds.amazonaws.com',
  port: 3306,
  username:'circuitos_fruver',
  password: 'vWsPJtMVC8Es*YAF',
  database: 'inventario-fruver',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
