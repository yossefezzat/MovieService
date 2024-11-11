import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const username = process.env.DATABASE_USERNAME;
        const password = process.env.DATABASE_PASSWORD;
        const database = process.env.DATABASE_NAME;
        const host = process.env.DATABASE_HOST;

        return {
          uri: `mongodb://${username}:${password}@${host}`,
          dbName: database,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
