import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IExercise, ExerciseTypeEnum } from './interfaces/exercise.interface';
import { Model } from 'mongoose';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel('Exercise') private exerciseModel: Model<IExercise>,
  ) {}

  async findAll(): Promise<IExercise[]> {
    return this.exerciseModel.find();
  }

  async findById(exerciseId: string): Promise<IExercise> {
    return this.exerciseModel.findOne({ _id: exerciseId });
  }

  async findCompound(): Promise<IExercise[]> {
    return this.exerciseModel.find({ type: ExerciseTypeEnum.compound });
  }

  async findIsolation(): Promise<IExercise[]> {
    return this.exerciseModel.find({ type: ExerciseTypeEnum.isolation }).exec();
  }

  async create(createExerciseDto: CreateExerciseDto): Promise<IExercise> {
    const newExercise = new this.exerciseModel(createExerciseDto);

    return newExercise.save();
  }

  async delete(exerciseId: string): Promise<IExercise> {
    return this.exerciseModel.findByIdAndRemove(exerciseId);
  }

  async update(
    exerciseId: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<IExercise> {
    return this.exerciseModel.findOneAndUpdate(
      { _id: exerciseId },
      updateExerciseDto,
      { new: true },
    );
  }
}
