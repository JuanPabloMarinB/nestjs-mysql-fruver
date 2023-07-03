import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { VentasController } from 'src/controllers/ventasController';
import { Ventas } from 'src/entities/Ventas.entity';
import { ventasRepository } from 'src/repository/ventasRepository';
import { VentasService } from 'src/services/VentaService';

@Module({
  controllers: [VentasController],
  providers: [VentasService, ventasRepository ],
  imports: [TypeOrmModule.forFeature([Ventas])],
})


export class ventasModule {}