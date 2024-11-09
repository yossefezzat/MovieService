import { MongoClient, Db } from 'mongodb';
import { Provider } from '@nestjs/common';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

let dbInstance: Db;

export const databaseProviders: Provider[] = [
  {
    provide: DATABASE_CONNECTION,

    useFactory: async (): Promise<Db> => {
      if (!dbInstance) {
        const uri =
          process.env.MONGO_DATABASE_URI || 'mongodb://localhost:27017';
        const client = new MongoClient(uri);

        await client.connect();
        dbInstance = client.db(process.env.MONGO_DATABASE_NAME || 'moviedb');
      }
      return dbInstance;
    },
  },
];
