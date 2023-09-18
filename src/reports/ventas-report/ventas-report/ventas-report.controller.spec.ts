import { Test, TestingModule } from '@nestjs/testing';
import { VentasReportController } from './ventas-report.controller';
import { VentasReportService } from './ventas-report.service';

describe('VentasReportController', () => {
  let controller: VentasReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentasReportController],
      providers: [VentasReportService],
    }).compile();

    controller = module.get<VentasReportController>(VentasReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
