import * as mongoose from 'mongoose';

export const RoutineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    history: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Log', default: null },
    ],
    routineData: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true,
        },
        initialSets: { type: Number, required: true },
        initialReps: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);
