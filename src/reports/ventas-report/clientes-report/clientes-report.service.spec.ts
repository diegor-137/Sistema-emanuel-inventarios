import { Test, TestingModule } from '@nestjs/testing';
import { ClientesReportService } from './clientes-report.service';

describe('ClientesReportService', () => {
  let service: ClientesReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientesReportService],
    }).compile();

    service = module.get<ClientesReportService>(ClientesReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
