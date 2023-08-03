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
import { Producto } from 'src/entities/Producto.entity';
import { MetodoPago } from 'src/enums/MetodoPago';

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
    @Body('productos') productos: Producto[],
    @Body('efectivo') efectivo: number,
    @Body('cantidadVenta') cantidadVenta: number[],
    @Body('metodoPago') metodoPago: MetodoPago,
  ) {
    const venta = this.ventasService.registrarVenta(
      productos,
      efectivo,
      cantidadVenta,
      metodoPago,
    );

    // Convierte el objeto a JSON manualmente y excluye la propiedad que causa la referencia circular.
    const json = JSON.stringify(venta, (key, value) => {
      if (key === 'venta') {
        return undefined;
      }
      return value;
    });

    // Devuelve el JSON como respuesta.
    return json;
  }
}
