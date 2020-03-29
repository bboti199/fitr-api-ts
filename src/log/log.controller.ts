import {
  Controller,
  Get,
  UseGuards,
  Post,
  HttpCode,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { LogService } from './log.service';
import { User } from 'src/user/decorators/user.decorator';
import { IUser } from 'src/user/interfaces/user.interface';
import { FirebaseAuthGuard } from 'src/user/guards/auth.guard';
import { CreateLogDto } from './dto/create-log.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('logs')
@UseGuards(FirebaseAuthGuard)
@Controller('log')
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  async findAll(@User() user: IUser) {
    const logs = await this.logService.findAll(user);

    return {
      count: logs.length,
      data: logs,
    };
  }

  @Get(':id')
  async find(@User() user: IUser, @Param('id') logId: string) {
    const log = await this.logService.find(user, logId);

    return {
      data: log,
    };
  }

  @Post()
  @HttpCode(201)
  async create(@User() user: IUser, @Body() createLogDto: CreateLogDto) {
    const log = await this.logService.create(user, createLogDto);

    return {
      data: log,
    };
  }

  @Delete(':id')
  async delete(@User() user: IUser, @Param('id') logId: string) {
    const log = await this.logService.delete(user, logId);

    return {
      data: log,
    };
  }
}
