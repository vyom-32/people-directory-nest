import { BadRequestException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Person } from './models/person.model';
import { Email } from './models/email.model';
import { Mobile } from './models/mobile.model';
import { Address } from './models/address.model';

const sequelizeModelArray = [Person, Email, Mobile, Address];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures ConfigService is available globally
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'), // plus sign for converting string to number
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadModels: true,
        logQueryParameters: true,
        synchronize: false,
        logging: console.log,
        timezone: '+05:30',
        repositoryMode: true,
        dialectOptions: {
          dateStrings: true,
          typeCast: true,
          multipleStatements: true,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature(sequelizeModelArray),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
