import { Test, TestingModule } from '@nestjs/testing';
import { MessagesModule } from './messages.module';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';

describe('MessagesController', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        MessagesModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module.get<MessagesController>(MessagesController)).toBeDefined();
  });
});
