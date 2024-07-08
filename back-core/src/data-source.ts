import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Association } from './associations/association.entity';
import { TypeAssociations } from './type-associations/type-associations.entity';
import { Role } from './roles/role.entity';

export const AppDataSource = new DataSource({
    
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    entities: [User, Association, TypeAssociations, Role /* ajoutez toutes vos entités ici */],
    synchronize: false,
    migrations: ['src/migration/*.ts'],
  });
