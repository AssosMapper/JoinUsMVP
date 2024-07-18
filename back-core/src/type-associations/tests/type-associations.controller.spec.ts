import { Test, TestingModule } from '@nestjs/testing';
import { TypeAssociationsController } from '../type-associations.controller';

describe('TypeAssociationsController', () => {
  let controller: TypeAssociationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeAssociationsController],
    }).compile();

    controller = module.get<TypeAssociationsController>(TypeAssociationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
