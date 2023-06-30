import { Module } from '@nestjs/common';
import { productController } from '../controllers/productController';
import { ProductService } from '../services/ProductService';
import { productoRepository } from '../repository/productoRepository';
import { Producto } from '../entities/Producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  controllers: [productController],
  providers: [ProductService, productoRepository],
  imports: [TypeOrmModule.forFeature([Producto])],
})


export class productModule {}
