import { Document } from 'mongoose';

export interface ILog extends Document {
  routine: string;
  user: string;
  workout: [
    { exercise: string; weight: number[]; sets: number; reps: number[] },
  ];
  createdAt: Date;
  updatedAt: Date;
}
