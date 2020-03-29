import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutineSchema } from './schemas/routine.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { LogSchema } from 'src/log/schemas/log.schema';
import { ExerciseSchema } from 'src/exercise/schemas/exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Routine', schema: RoutineSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Log', schema: LogSchema },
      { name: 'Exercise', schema: ExerciseSchema },
    ]),
  ],
  providers: [RoutineService],
  controllers: [RoutineController],
})
export class RoutineModule {}
