import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './typeorm.config';
import { productModule } from './productModule';
import { userModule } from './userModule';
import { Producto } from '../entities/Producto.entity';
import { ProductService } from '../services/ProductService';
import { JwtAuthGuard } from '../modules/Jwt-auth.guard';
import { Usuario } from '../entities/Usuario.entity';
import { UserService } from '../services/UserService';
import { Ventas } from '../entities/Ventas.entity';
import { Categoria } from '../entities/Categoria.entity';
import { productController } from '../controllers/productController';
import { userController } from '../controllers/userController';
import { JwtService } from '@nestjs/jwt';
import { EnumController } from 'src/controllers/enumsController';
import { ventasModule } from './ventasModule';
import { VentasService } from 'src/services/VentaService';
import { VentasController } from 'src/controllers/ventasController';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([
      Producto,
      Usuario,
      Ventas,
      Categoria,
      productModule,
      ventasModule,
      userModule,
    ]),
  ],
  controllers: [productController, userController, EnumController, VentasController],
  providers: [ProductService, JwtAuthGuard, UserService,  JwtService, VentasService],
})
export class AppModule {}
