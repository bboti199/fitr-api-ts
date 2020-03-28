import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { FirebaseAuthGuard } from 'src/user/guards/auth.guard';
import { IUser } from 'src/user/interfaces/user.interface';
import { User } from 'src/user/decorators/user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('exercise')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Get()
  async findAll(@User() user: IUser) {
    const exercises = await this.exerciseService.findAll(user);
    return {
      count: exercises.length,
      data: exercises,
    };
  }

  @Get('compound')
  async findCompound(@User() user: IUser) {
    const exercises = await this.exerciseService.findCompound(user);
    return {
      count: exercises.length,
      data: exercises,
    };
  }

  @Get('isolation')
  async findIsolation(@User() user: IUser) {
    const exercises = await this.exerciseService.findIsolation(user);
    return {
      count: exercises.length,
      data: exercises,
    };
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
    @User() user: IUser,
  ) {
    const exercise = await this.exerciseService.create(createExerciseDto, user);
    return {
      data: exercise,
    };
  }

  @Delete(':id')
  async delete(@Param('id') exerciseId: string, @User() user: IUser) {
    const exercise = await this.exerciseService.delete(exerciseId, user);
    return {
      data: exercise,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @User() user: IUser,
  ) {
    return {
      data: await this.exerciseService.update(
        exerciseId,
        updateExerciseDto,
        user,
      ),
    };
  }
}
