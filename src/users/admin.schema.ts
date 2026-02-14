import { Schema } from '@nestjs/mongoose';
import { User } from './user.schema';

@Schema()
export class Admin extends User { }