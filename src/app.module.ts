import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ExerciseModule } from './exercise/exercise.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { RoutineModule } from './routine/routine.module';
import { LogModule } from './log/log.module';
//import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

// const host =
//   process.env.NODE_ENV === 'production' ? process.env.REDIS_HOST : 'localhost';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }),
    ExerciseModule,
    UserModule,
    RoutineModule,
    LogModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
