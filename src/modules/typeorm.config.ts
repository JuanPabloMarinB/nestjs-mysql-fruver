import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'database-fruver.cserjyebsqnn.us-east-2.rds.amazonaws.com',
  port: Number.parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'circuitos_aws',
  password: process.env.DB_PASSWORD || 'juanito21A#',
  database: process.env.DB_NAME || 'db-fruver',
  ssl: {
    rejectUnauthorized: false,

  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
