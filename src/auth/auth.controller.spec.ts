import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';

describe('AuthController', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        AuthModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module.get<AuthController>(AuthController)).toBeDefined();
  });
});
