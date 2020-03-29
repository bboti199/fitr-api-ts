import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ILog } from './interfaces/log.interface';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/user/interfaces/user.interface';
import { CreateLogDto } from './dto/create-log.dto';
import { IRoutine } from 'src/routine/interfaces/routine.interface';
import { IExercise } from 'src/exercise/interfaces/exercise.interface';

@Injectable()
export class LogService {
  constructor(
    @InjectModel('Log') private logModel: Model<ILog>,
    @InjectModel('Routine') private routineModel: Model<IRoutine>,
    @InjectModel('Exercise') private exerciseModel: Model<IExercise>,
  ) {}

  async findAll(user: IUser): Promise<ILog[]> {
    return this.logModel
      .find({ user: user._id })
      .sort('-createdAt')
      .populate('workout.exercise')
      .populate('routine', { _id: 1, name: 1, description: 1 });
  }

  async find(user: IUser, logId: string): Promise<ILog> {
    const log = await this.logModel.findOne({
      $and: [{ user: user._id }, { _id: logId }],
    });

    if (!log) {
      throw new NotFoundException('Log not found');
    }

    return log;
  }

  async create(user: IUser, createLogDto: CreateLogDto): Promise<ILog> {
    const routine = await this.routineModel.findOne({
      $and: [{ owner: user._id }, { _id: createLogDto.routine }],
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    await Promise.all(
      createLogDto.workout.map(async workoutItem => {
        const exerciseExists = await this.exerciseModel.exists({
          _id: workoutItem.exercise,
        });

        if (!exerciseExists) {
          throw new NotFoundException(
            `The exercise with the id of ${workoutItem.exercise} does not exist`,
          );
        }
      }),
    );

    const newLog = new this.logModel({ ...createLogDto, user: user._id });

    routine.history.unshift(newLog._id);

    await routine.save();

    return newLog.save();
  }

  async delete(user: IUser, logId: string): Promise<ILog> {
    const logItem = await this.logModel.findOne({
      $and: [{ user: user._id }, { _id: logId }],
    });

    if (!logItem) {
      throw new NotFoundException('Log not found');
    }

    const routine = await this.routineModel.findById(logItem.routine);

    routine.history = routine.history.filter(
      historyItem => historyItem === logItem._id,
    );

    await routine.save();

    return logItem.remove();
  }
}
