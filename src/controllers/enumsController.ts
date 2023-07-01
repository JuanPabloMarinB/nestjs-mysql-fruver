import { Controller, Get } from '@nestjs/common';
import { Medida } from '../enums/Medida';
import { CategoriaEnum } from '../enums/CategoriaEnum';

@Controller('enums')
export class EnumController {
  @Get('medida')
  getMedidaEnum() {
    return Object.values(Medida);
  }

  @Get('Categoria')
  getCategoriaEnum() {
    return Object.values(CategoriaEnum);
  }
}