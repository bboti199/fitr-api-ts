import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercise')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Get()
  async findAll() {
    const exercises = await this.exerciseService.findAll();
    return {
      count: exercises.length,
      data: exercises,
    };
  }

  @Get('compound')
  async findCompound() {
    const exercises = await this.exerciseService.findCompound();
    return {
      count: exercises.length,
      data: exercises,
    };
  }

  @Get('isolation')
  async findIsolation() {
    const exercises = await this.exerciseService.findIsolation();
    return {
      count: exercises.length,
      data: exercises,
    };
  }

  @Get(':id')
  async findOne(@Param('id') exerciseId: string) {
    const exercise = await this.exerciseService.findById(exerciseId);
    return {
      data: exercise,
    };
  }

  @Post()
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    const exercise = await this.exerciseService.create(createExerciseDto);
    return {
      data: exercise,
    };
  }

  @Delete(':id')
  async delete(@Param('id') exerciseId: string) {
    const exercise = await this.exerciseService.delete(exerciseId);
    return {
      data: exercise,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return {
      data: await this.exerciseService.update(exerciseId, updateExerciseDto),
    };
  }
}
