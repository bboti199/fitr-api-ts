import { Document } from 'mongoose';

export enum ExerciseTypeEnum {
  compound = 'compound',
  isolation = 'isolation',
}

export interface IExercise extends Document {
  name: string;
  bodyPart: string;
  type: ExerciseTypeEnum;
  owner: string | null;
  createdAt: Date;
  updatedAt: Date;
}
