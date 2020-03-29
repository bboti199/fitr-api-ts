import { Document } from 'mongoose';
import { IExercise } from 'src/exercise/interfaces/exercise.interface';

export interface ILog extends Document {
  routine: string;
  user: string;
  workout: [
    {
      exercise: string | IExercise;
      weight: number[];
      sets: number;
      reps: number[];
    },
  ];
  createdAt: Date;
  updatedAt: Date;
}
