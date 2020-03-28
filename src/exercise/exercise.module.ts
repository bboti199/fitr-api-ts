import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseSchema } from './schemas/exercise.schema';
import { UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Exercise', schema: ExerciseSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [ExerciseService],
  controllers: [ExerciseController],
})
export class ExerciseModule {}
