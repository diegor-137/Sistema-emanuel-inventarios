import { Test, TestingModule } from '@nestjs/testing';
import { VentasReportService } from './ventas-report.service';

describe('VentasReportService', () => {
  let service: VentasReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VentasReportService],
    }).compile();

    service = module.get<VentasReportService>(VentasReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
