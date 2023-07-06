import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'inventario.chagjnxwnsad.us-east-2.rds.amazonaws.com',
  port: 3306,
  username:'circuitos_aws',
  password: 'VuwmtUP*fRyX!Y01',
  database: 'inventario',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
