import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { VentasController } from 'src/controllers/ventasController';
import { Ventas } from 'src/entities/Ventas.entity';
import { VentasXDia } from 'src/entities/VentasXDia.entity';
import { ventasRepository } from 'src/repository/ventasRepository';
import { VentasXDiaRepository } from 'src/repository/ventasXdiaRepository';
import { VentasService } from 'src/services/VentaService';

@Module({
  controllers: [VentasController],
  providers: [VentasService, ventasRepository, VentasXDiaRepository ],
  imports: [TypeOrmModule.forFeature([Ventas, VentasXDia])],
})


export class ventasModule {}