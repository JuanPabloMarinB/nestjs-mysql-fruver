import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './typeorm.config';
import { productModule } from './productModule';
import { userModule } from './userModule';
import { Producto } from '../entities/Producto.entity';
import { ProductService } from '../services/ProductService';
import { JwtAuthGuard } from '../modules/jwt-auth.guard';
import { Usuario } from '../entities/Usuario.entity';
import { UserService } from '../services/UserService';
import { Repository } from 'typeorm';
import { Ventas } from '../entities/Ventas.entity';
import { Categoria } from '../entities/Categoria.entity';
import { productController } from '../controllers/productController';
import { userController } from '../controllers/userController';
import { productoRepository } from '../repository/productoRepository';
import { UserRepository } from '../repository/UserRepository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([
      Producto,
      Usuario,
      Ventas,
      Categoria,
      productModule,
      userModule,
    ]),
  ],
  controllers: [productController, userController],
  providers: [ProductService, JwtAuthGuard, UserService,  JwtService],
})
export class AppModule {}
