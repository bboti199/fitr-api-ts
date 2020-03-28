import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ExerciseTypeEnum } from '../interfaces/exercise.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExerciseDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bodyPart?: string;

  @ApiProperty({ enum: ['isolation', 'compound'] })
  @IsEnum(ExerciseTypeEnum)
  @IsOptional()
  type?: ExerciseTypeEnum;
}
