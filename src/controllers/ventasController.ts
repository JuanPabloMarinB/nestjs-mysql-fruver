import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
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

  @Get(':dia')
  getVentaDia(@Query('dia') diaVenta?: string) {
    console.log('Entre al controlador línea 43');
    console.log(diaVenta);
    let fechaVenta: Date;
    if (diaVenta) {
      const [year, month, day] = diaVenta.split('-').map(Number);
      fechaVenta = new Date(year, month - 1, day);
      console.log(fechaVenta);
      
    }
    return this.ventasService.getVentaDia(fechaVenta);
  }

  @Get(':id')
  //Esta función ParseIntPipe convierte lo que venga a numero entero. Es bueno ponerlo para asegurarse de que lo que viene es un número entero.
  getVentaId(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    console.log(typeof id);
    return this.ventasService.getVentaId(id);
  }

  @Post('registro-venta')
  registrarVenta(
    @Body('venta') venta: Ventas,
    @Body('cantidadVenta') cantidadVenta: number[],
  ) {
    return this.ventasService.registrarVenta(venta, cantidadVenta);
  }
}
