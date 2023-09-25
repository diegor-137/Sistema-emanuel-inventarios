import { Test, TestingModule } from '@nestjs/testing';
import { CompraReportService } from './compra-report.service';

describe('CompraReportService', () => {
  let service: CompraReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompraReportService],
    }).compile();

    service = module.get<CompraReportService>(CompraReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
