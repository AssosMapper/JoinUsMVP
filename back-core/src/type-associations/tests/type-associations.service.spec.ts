import { Test, TestingModule } from '@nestjs/testing';
import { TypeAssociationsService } from '../type-associations.service';

describe('TypeAssociationsService', () => {
  let service: TypeAssociationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeAssociationsService],
    }).compile();

    service = module.get<TypeAssociationsService>(TypeAssociationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
