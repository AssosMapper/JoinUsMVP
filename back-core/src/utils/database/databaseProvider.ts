<<<<<<< HEAD
import { DataSource } from 'typeorm';
import * as process from 'process';
=======
import * as process from 'process';
import { DataSource } from 'typeorm';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

export const DatabaseProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT as string) || 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    });

    return dataSource.initialize();
  },
<<<<<<< HEAD
};
=======
};
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
