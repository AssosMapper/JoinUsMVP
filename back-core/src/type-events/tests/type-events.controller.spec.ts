import { Test, TestingModule } from '@nestjs/testing';
import { TypeEventsController } from '../type-events.controller';

describe('TypeEventsController', () => {
  let controller: TypeEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeEventsController],
    }).compile();

    controller = module.get<TypeEventsController>(TypeEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
