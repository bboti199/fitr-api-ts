import * as mongoose from 'mongoose';

export const LogSchema = new mongoose.Schema(
  {
    routine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Routine',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workout: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true,
        },
        weight: {
          type: [Number],
          required: true,
        },
        sets: {
          type: Number,
          required: true,
        },
        reps: {
          type: [Number],
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);
