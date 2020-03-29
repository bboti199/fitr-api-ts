import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkoutDataType {
  @IsMongoId()
  @IsNotEmpty()
  exercise: string;

  @IsNotEmpty()
  @IsNumber()
  sets: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  weight: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  reps: number[];
}

export class CreateLogDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  routine: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => WorkoutDataType)
  workout: WorkoutDataType[];
}
