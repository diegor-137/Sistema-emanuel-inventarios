import { Test, TestingModule } from '@nestjs/testing';
import { RecepcionController } from './recepcion.controller';
import { RecepcionService } from './recepcion.service';

describe('RecepcionController', () => {
  let controller: RecepcionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecepcionController],
      providers: [RecepcionService],
    }).compile();

    controller = module.get<RecepcionController>(RecepcionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
