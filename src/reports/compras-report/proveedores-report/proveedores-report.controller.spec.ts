import { Test, TestingModule } from '@nestjs/testing';
import { ProveedoresReportController } from './proveedores-report.controller';
import { ProveedoresReportService } from './proveedores-report.service';

describe('ProveedoresReportController', () => {
  let controller: ProveedoresReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedoresReportController],
      providers: [ProveedoresReportService],
    }).compile();

    controller = module.get<ProveedoresReportController>(ProveedoresReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
