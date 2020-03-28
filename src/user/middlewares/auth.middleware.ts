import {
  NestMiddleware,
  Injectable,
  Response,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';
import { Model } from 'mongoose';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}
  use(req: Request, res: Response, next: Function) {
    let token: string | null;

    console.log(req.headers);

    if (
      req.headers['authorization'] &&
      req.headers.get['authorization'].startsWith('Bearer')
    ) {
      token = req.headers.get['authorization'].split(' ')[1];
    }

    if (!token) {
      throw new HttpException('Not authorized to access this route', 403);
    }

    next();
  }
}
