import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Res,
    ParseIntPipe,
} from '@nestjs/common';
import { VentasService } from './../services/VentaService';
import { Ventas } from 'src/entities/Ventas.entity';

@Controller('venta')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

    @Get()
    getVentas(): Promise<Ventas[]> {
        return this.ventasService.getVentas();
    }

    @Get(':id')
    //Esta función ParseIntPipe convierte lo que venga a numero entero. Es bueno ponerlo para asegurarse de que lo que viene es un número entero.
    getVentaId(@Param('id', ParseIntPipe) id: number) {
        console.log(id)
        console.log(typeof id)
        return this.ventasService.getVentaId(id);
    }

  @Post('registro-venta')
  registrarVenta(
    @Body('venta') venta: Ventas,
    @Body('cantidadVenta') cantidadVenta: number[],
  ) {
    return this.ventasService.registrarVenta(
      venta,
      cantidadVenta,
    );
  }
}