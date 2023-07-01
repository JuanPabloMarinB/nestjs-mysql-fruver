import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'containers-us-west-192.railway.app',
  port: Number.parseInt(process.env.DB_PORT) || 7362,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'gFFdMTGQfi9q9JG0uinY',
  database: process.env.DB_NAME || 'railway',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
