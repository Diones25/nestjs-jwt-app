import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any || 'mariadb',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: process.env.TYPEORM_PORT ? parseInt(process.env.TYPEORM_PORT, 10) : 3306,
      username: process.env.TYPEORM_USERNAME || 'root',
      password: '',
      database: process.env.TYPEORM_DATABASE || 'nestjs_jwt_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    } as TypeOrmModuleOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
