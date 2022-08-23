import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_DB_PASSWORD || '123456',
  database: process.env.POSTGRES_DATABASE || 'bloggers',
  entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
  synchronize: false,
  //ssl: { rejectUnauthorized: false },
};
export default ormConfig;
