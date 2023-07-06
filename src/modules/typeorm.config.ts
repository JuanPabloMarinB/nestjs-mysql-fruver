import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'inventario.ctjpcrngdxjd.us-east-2.rds.amazonaws.com',
  port: Number.parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'circuitos_aws',
  password: process.env.DB_PASSWORD || 'VuwmtUP*fRyX!Y01',
  database: process.env.DB_NAME || 'inventario',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
