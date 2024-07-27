import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { UserActivityEntity } from './model/user-activities.entity';
import { StravaEntity } from './model/strava.entity';

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
        StravaEntity
      ],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
