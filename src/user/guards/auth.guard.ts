import * as firebaseAdmin from 'firebase-admin';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';
import { Model } from 'mongoose';

export class FirebaseAuthGuard implements CanActivate {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token;

    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    if (authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    } else {
      return false;
    }

    try {
      const decoded = await firebaseAdmin.auth().verifyIdToken(token);

      const userData = await firebaseAdmin.auth().getUser(decoded.uid);

      let localUser = await this.userModel.findOne({
        fid: userData.uid,
      });

      if (localUser) {
        context.switchToHttp().getRequest().headers.user = localUser;
      } else {
        localUser = new this.userModel({
          email: userData.email,
          fid: userData.uid,
        });

        await localUser.save();
        context.switchToHttp().getRequest().headers.user = localUser;

        return true;
      }
    } catch (error) {
      throw new UnauthorizedException(
        { error: 'You are not authorized to access this resouce' },
        '',
      );
    }

    return true;
  }
}
