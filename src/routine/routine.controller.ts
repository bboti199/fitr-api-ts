import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  HttpCode,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/user/guards/auth.guard';
import { RoutineService } from './routine.service';
import { User } from 'src/user/decorators/user.decorator';
import { IUser } from 'src/user/interfaces/user.interface';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TimePeriodType } from './interfaces/routine.interface';

@ApiBearerAuth()
@ApiTags('routines')
@UseGuards(FirebaseAuthGuard)
@Controller('routine')
export class RoutineController {
  constructor(private routineService: RoutineService) {}

  @Get()
  async findAll(@User() user: IUser) {
    const routines = await this.routineService.findAll(user);

    return {
      count: routines.length,
      data: routines,
    };
  }

  @Get(':id/history')
  async getHistory(@User() user: IUser, @Param('id') routineId: string) {
    const routineHistory = await this.routineService.getHistory(
      user,
      routineId,
    );

    return {
      count: routineHistory.length,
      data: routineHistory,
    };
  }

  @Get(':id/chart/:timePeriod')
  async getChartData(
    @User() user: IUser,
    @Param('id') routineId: string,
    @Param('timePeriod') timePeriod: TimePeriodType,
  ) {
    return this.routineService.getChartData(user, routineId, timePeriod);
  }

  @Post()
  @HttpCode(201)
  async create(
    @User() user: IUser,
    @Body() createRoutineDto: CreateRoutineDto,
  ) {
    const routine = await this.routineService.create(user, createRoutineDto);

    return {
      data: routine,
    };
  }

  @Delete(':id')
  async delete(@User() user: IUser, @Param('id') routineId: string) {
    const routine = await this.routineService.delete(user, routineId);

    return {
      data: routine,
    };
  }

  @Patch(':id')
  async update(
    @User() user: IUser,
    @Param('id') routineId: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ) {
    const routine = await this.routineService.update(
      user,
      routineId,
      updateRoutineDto,
    );

    return {
      data: routine,
    };
  }
}
