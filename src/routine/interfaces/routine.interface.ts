import { Document } from 'mongoose';
import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';

export interface IRoutine extends Document {
  name: string;
  description: string | null;
  owner: string;
  history: string[];
  routineData: [{ exercise: string; initialSets: number; initialReps: number }];
  createdAt: Date;
  updatedAt: Date;
}

export class RoutineDataType {
  @IsMongoId()
  @IsNotEmpty()
  exercise: string;

  @IsNumber()
  @IsNotEmpty()
  initialSets: number;

  @IsNumber()
  @IsNotEmpty()
  initialReps: number;
}
