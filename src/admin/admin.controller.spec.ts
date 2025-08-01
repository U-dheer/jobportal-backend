import { Test, TestingModule } from '@nestjs/testing';
import { AdminModule } from './admin.module';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';

describe('AdminController', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        AdminModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module.get<AdminController>(AdminController)).toBeDefined();
  });
});
