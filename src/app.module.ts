import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { UserActivityEntity } from './model/user-activities.entity';
import AuthenticationModule from './api/authentications/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import ActivitiesModule from './api/activities/activities.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: '127.0.0.1',
      port: 5432,
      username: "toxic",
      password: "toxic2024",
      database: "toxic_db",
      type: 'postgres',
      entities: [
        UserEntity,
        UserActivityEntity,
      ],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '48h' },
    }),
    AuthenticationModule,
    ActivitiesModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
