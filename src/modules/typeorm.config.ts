import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'fruveraws.cjrcbjueogp4.us-east-2.rds.amazonaws.com',
  port: 3306,
  username:'fruver_aws',
  password: 'j!6AojkGOqGWPz*8',
  database: 'inventario',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;