import { Test, TestingModule } from '@nestjs/testing';
import { TypeEventsService } from './type-events.service';

describe('TypeEventsService', () => {
  let service: TypeEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeEventsService],
    }).compile();

    service = module.get<TypeEventsService>(TypeEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
