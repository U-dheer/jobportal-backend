import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsModule } from './applications.module';
import { ApplicationsController } from './applications.controller';
import { MongooseModule } from '@nestjs/mongoose';

describe('ApplicationsController', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        ApplicationsModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module.get<ApplicationsController>(ApplicationsController)).toBeDefined();
  });
});
