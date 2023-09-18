import { Test, TestingModule } from '@nestjs/testing';
import { ProveedoresReportService } from './proveedores-report.service';

describe('ProveedoresReportService', () => {
  let service: ProveedoresReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProveedoresReportService],
    }).compile();

    service = module.get<ProveedoresReportService>(ProveedoresReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
