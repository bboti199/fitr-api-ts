import { Document } from 'mongoose';

export enum UserRoleEnum {
  user = 'user',
  admin = 'admin',
}

export interface IUser extends Document {
  email: string;
  fid: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
}
