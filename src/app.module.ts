import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ExerciseModule } from './exercise/exercise.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { RoutineModule } from './routine/routine.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
