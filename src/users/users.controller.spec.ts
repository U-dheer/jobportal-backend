import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';

describe('UsersController', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        UsersModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module.get<UsersController>(UsersController)).toBeDefined();
  });
});
