import { Injectable } from '@nestjs/common';
import { DataService } from '../common/service/common.service';
import { Sucursal } from './entity/sucursal.entity';

@Injectable()
export class SucursalService extends DataService(Sucursal){}
