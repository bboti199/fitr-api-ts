import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IExercise, ExerciseTypeEnum } from './interfaces/exercise.interface';
import { Model } from 'mongoose';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { IUser, UserRoleEnum } from 'src/user/interfaces/user.interface';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel('Exercise') private exerciseModel: Model<IExercise>,
  ) {}

  async findAll(user: IUser): Promise<IExercise[]> {
    return this.exerciseModel
      .find({ $or: [{ owner: user._id }, { owner: null }] })
      .sort('-createdAt');
  }

  async findCompound(user: IUser): Promise<IExercise[]> {
    return this.exerciseModel.find({
      $and: [
        { type: ExerciseTypeEnum.compound },
        {
          $or: [
            {
              owner: null,
            },
            {
              owner: user._id,
            },
          ],
        },
      ],
    });
  }

  async findIsolation(user: IUser): Promise<IExercise[]> {
    return this.exerciseModel
      .find({
        $and: [
          { type: ExerciseTypeEnum.isolation },
          {
            $or: [
              {
                owner: null,
              },
              {
                owner: user._id,
              },
            ],
          },
        ],
      })
      .exec();
  }

  async create(
    createExerciseDto: CreateExerciseDto,
    user: IUser,
  ): Promise<IExercise> {
    const newExercise = new this.exerciseModel({
      ...createExerciseDto,
      owner: user._id,
    });

    return newExercise.save();
  }

  async delete(exerciseId: string, user: IUser): Promise<IExercise> {
    if (user.role === UserRoleEnum.admin) {
      return this.exerciseModel.findByIdAndRemove(exerciseId);
    }

    return this.exerciseModel.findOneAndRemove({
      $and: [{ owner: user._id }, { _id: exerciseId }],
    });
  }

  async update(
    exerciseId: string,
    updateExerciseDto: UpdateExerciseDto,
    user,
  ): Promise<IExercise> {
    if (user.role === UserRoleEnum.admin) {
      return this.exerciseModel.findByIdAndUpdate(
        exerciseId,
        updateExerciseDto,
      );
    }

    return this.exerciseModel.findOneAndUpdate(
      { $and: [{ owner: user._id }, { _id: exerciseId }] },
      updateExerciseDto,
      { new: true },
    );
  }
}
