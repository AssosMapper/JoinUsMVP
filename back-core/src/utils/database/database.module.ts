import { Module, DynamicModule, Global } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseProvider } from './databaseProvider';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(entities: any[]): DynamicModule {
    const providers = entities.map((entity) => {
      const entityName = entity.name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();

      return {
        provide: `${entityName}_REPOSITORY`,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
        inject: ['DATA_SOURCE'],
      };
    });

    return {
      module: DatabaseModule,
      providers: [...providers, DatabaseProvider],
      exports: providers,
    };
  }
}
