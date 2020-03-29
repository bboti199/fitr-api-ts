import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './schemas/log.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { ExerciseSchema } from 'src/exercise/schemas/exercise.schema';
import { RoutineSchema } from 'src/routine/schemas/routine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Log', schema: LogSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Exercise', schema: ExerciseSchema },
      { name: 'Routine', schema: RoutineSchema },
    ]),
  ],
  providers: [LogService],
  controllers: [LogController],
})
export class LogModule {}
