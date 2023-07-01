import { Controller, Get } from '@nestjs/common';
import { Medida } from '../enums/Medida';

@Controller('enums')
export class EnumController {
  @Get('medida')
  getMedidaEnum() {
    return Object.values(Medida);
  }
}