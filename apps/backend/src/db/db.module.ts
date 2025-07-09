import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModelName, UserSchema, UseModelName, UseSchema, GuestSchema, GuestModelName } from './schema';
import { CreditOrderModelName, CreditOrderSchema } from './schema/credit-order.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DB_URI') as string,
      }),
    }),
    MongooseModule.forFeature([
      { schema: UserSchema, name: UserModelName },
      { schema: UseSchema, name: UseModelName },
      { schema: GuestSchema, name: GuestModelName },
      { schema: CreditOrderSchema, name: CreditOrderModelName },
    ]),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
