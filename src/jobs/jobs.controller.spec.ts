import { Test, TestingModule } from '@nestjs/testing';
import { JobsModule } from './jobs.module';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';

describe('JobsController', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        JobsModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module.get<JobsController>(JobsController)).toBeDefined();
  });
});
