import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.HOST || "fruveraws.cjrcbjueogp4.us-east-2.rds.amazonaws.com",
  port: parseInt(process.env.PORT) || 3306,
  username:process.env.USER || "fruver_aws",
  password: process.env.PASSWORD || "j!6AojkGOqGWPz*8",
  database: process.env.DATABASE || "inventario",
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;