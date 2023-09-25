import { Test, TestingModule } from '@nestjs/testing';
import { ClientesReportController } from './clientes-report.controller';
import { ClientesReportService } from './clientes-report.service';

describe('ClientesReportController', () => {
  let controller: ClientesReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesReportController],
      providers: [ClientesReportService],
    }).compile();

    controller = module.get<ClientesReportController>(ClientesReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
