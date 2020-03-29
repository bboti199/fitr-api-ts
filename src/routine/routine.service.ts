import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRoutine, TimePeriodType } from './interfaces/routine.interface';
import { Model } from 'mongoose';
import { IUser } from 'src/user/interfaces/user.interface';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { ILog } from 'src/log/interfaces/log.interface';
import { IExercise } from 'src/exercise/interfaces/exercise.interface';
import { calcAvg } from './utils/calcAvg';
import * as moment from 'moment';

@Injectable()
export class RoutineService {
  constructor(
    @InjectModel('Routine') private routineModel: Model<IRoutine>,
    @InjectModel('Log') private logModel: Model<ILog>,
    @InjectModel('Exercise') private exerciseModel: Model<IExercise>,
  ) {}

  async findAll(user: IUser): Promise<IRoutine[]> {
    return this.routineModel
      .find({ owner: user._id })
      .populate('routineData.exercise', {
        _id: 1,
        name: 1,
        bodyPart: 1,
        type: 1,
      })
      .populate('owner');
  }

  async getChartData(
    user: IUser,
    routineId: string,
    timePeriod: TimePeriodType,
  ): Promise<any> {
    const routine = await this.routineModel.findOne({
      $and: [{ owner: user._id }, { _id: routineId }],
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    let fromDate;

    if (timePeriod === TimePeriodType.all) {
      fromDate = moment(new Date(0));
    } else {
      fromDate = moment().subtract(1, timePeriod);
    }

    let logs = await Promise.all(
      routine.history.map(async historyId => {
        const log = await this.logModel
          .findOne({ _id: historyId })
          .populate('workout.exercise', { name: 1, _id: 1 });

        if (moment(log.createdAt).isAfter(fromDate)) {
          return log;
        }
      }),
    );

    logs = logs.filter(e => e !== null && e !== undefined);

    const transformedLogs = logs.map(logItem => {
      if (logItem) {
        return logItem.workout.map(workoutItem => {
          if (workoutItem) {
            const data = {
              exercise: (workoutItem.exercise as IExercise).name,
              weight: calcAvg(workoutItem.weight),
              workload:
                workoutItem.sets *
                calcAvg(workoutItem.weight) *
                calcAvg(workoutItem.reps),
              date: moment(logItem.createdAt).format('MM/DD'),
            };
            return data;
          }
        });
      }
    });

    const extract = (
      data: {
        exercise: string;
        weight: number;
        workload: number;
        date: string;
      }[][],
    ) => {
      const arr = data.reduce((acc, curr) => [...curr, ...acc], []);
      const res: any = {};

      arr.forEach(item => {
        const newItem = res[item.exercise] || {
          exercise: item.exercise,
          weight: [],
          workload: [],
          date: [],
        };

        ['weight', 'workload', 'date'].forEach(key => {
          newItem[key].push(item[key]);
        });

        res[item.exercise] = newItem;
      });
      return Object.values(res);
    };

    return extract(transformedLogs);
  }

  async getHistory(user: IUser, routineId: string): Promise<any[]> {
    const routine = await this.routineModel
      .findOne({ $and: [{ owner: user._id, _id: routineId }] })
      .populate({
        path: 'history',
        populate: {
          path: 'workout.exercise',
          select: { _id: 1, name: 1, bodyPart: 1, type: 1 },
        },
      });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    return routine.history;
  }

  async create(
    user: IUser,
    createRoutineDto: CreateRoutineDto,
  ): Promise<IRoutine> {
    await Promise.all(
      createRoutineDto.routineData.map(async routineDataItem => {
        const exerciseExists = await this.exerciseModel.exists({
          _id: routineDataItem.exercise,
        });

        if (!exerciseExists) {
          throw new NotFoundException(
            `The exercise with the id of ${routineDataItem.exercise} does not exist`,
          );
        }
      }),
    );

    const newRoutine = new this.routineModel({
      ...createRoutineDto,
      owner: user._id,
    });

    return newRoutine.save();
  }

  async delete(user: IUser, routineId: string): Promise<IRoutine> {
    const routine = await this.routineModel.findOne({
      $and: [{ owner: user._id, _id: routineId }],
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    await Promise.all(
      routine.history.map(async historyItem => {
        await this.logModel.findByIdAndDelete(historyItem);
      }),
    );

    return routine.remove();
  }

  async update(
    user: IUser,
    routineId: string,
    updateRoutineDto: UpdateRoutineDto,
  ): Promise<IRoutine> {
    return this.routineModel.findOneAndUpdate(
      { $and: [{ owner: user._id, _id: routineId }] },
      { ...updateRoutineDto },
      { new: true },
    );
  }
}
