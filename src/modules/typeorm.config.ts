import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'inventario.ctjpcrngdxjd.us-east-2.rds.amazonaws.com',
  port: 3306,
  username:'circuitos_aws',
  password: 'n2nU1#9loZxeW*6N',
  database: 'inventario',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
