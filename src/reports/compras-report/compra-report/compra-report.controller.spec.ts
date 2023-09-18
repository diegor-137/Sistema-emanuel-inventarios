import { Test, TestingModule } from '@nestjs/testing';
import { CompraReportController } from './compra-report.controller';
import { CompraReportService } from './compra-report.service';

describe('CompraReportController', () => {
  let controller: CompraReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompraReportController],
      providers: [CompraReportService],
    }).compile();

    controller = module.get<CompraReportController>(CompraReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
