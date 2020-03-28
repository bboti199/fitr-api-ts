import { ExerciseTypeEnum } from '../interfaces/exercise.interface';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bodyPart: string;

  @ApiProperty({ enum: ['isolation', 'compound'] })
  @IsNotEmpty()
  @IsEnum(ExerciseTypeEnum)
  type: ExerciseTypeEnum;
}
