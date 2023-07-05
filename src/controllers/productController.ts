import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Producto } from '../entities/Producto.entity';
import { ProductService } from '../services/ProductService';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('producto')
export class productController {
  constructor(private readonly productoService: ProductService) {}

  @Get()
  getAllProductos(): Promise<Producto[]> {
    return this.productoService.findAll();
  }

  @Get(':id')
  getProductoById(@Param('id') id: number): Promise<Producto> {
    return this.productoService.findById(id);
  }

  @Post('crear')
  createProducto(@Body() producto: Producto): Promise<Producto> {
    console.log(producto)
    return this.productoService.create(producto);
  }

  @Put(':id')
  updateProducto(
    @Param('id') id: number,
    @Body() producto: Producto,
  ): Promise<void> {
    return this.productoService.update(id, producto);
  }

  @Delete(':id')
  deleteProducto(@Param('id') id: number): Promise<void> {
    return this.productoService.delete(id);
  }

  @Get('portal')
  getHome(): string {
    // Código para retornar la vista de inicio (index.html) del portal
    return 'index.html';
  }

  @Get('create')
  getCreate(): string {
    // Código para retornar la vista de creación (crear.html) de un producto
    return 'crear.html';
  }

  @Post('save')
  saveProducto(@Body() producto: Producto) {
    // Código para guardar el producto y redireccionar a la página principal (index.html)
    return this.productoService.create(producto);
  }

  @Get('editar/:id')
  editProducto(@Param('id') id: number): string {
    // Código para obtener el producto por su id, agregarlo al modelo y retornar la vista de edición (index.html)
    return 'index.html';
  }

  @Get('producto/:id')
  getProducto(@Param('id') id: number): string {
    // Código para obtener el producto por su id, agregarlo al modelo y retornar la vista de detalle (index.html)
    return 'index.html';
  }

  @Get('registro')
  registerProducto(): string {
    // Código para retornar la vista de registro (registro.html) de un producto
    return 'registro.html';
  }

  @Post('registro')
  //@UseInterceptors(FileInterceptor('imagen'))
  async registrarProducto(
    @Body() producto: Producto,
    //@UploadedFile() imagen: Express.Multer.File,
  ) {
    await this.productoService.registrar(
      producto.nombre,
      producto.medida,
      producto.costoXunidad,
      producto.cantidadIngresada,
      producto.codigoBarra,
      producto.precioVenta,
      producto.categoria,
      //imagen,
    );

    return this.productoService.registrar;
  }
  
  @Get('registrar-venta')
  registrarVenta(): string {
    // Código para registrar una venta y redireccionar a la página principal (index.html)
    return 'redirect:/index';
  }

  @Get('mostrar-inventario')
  async mostrarInventario(@Res() res: any): Promise<void> {
    const productos = await this.productoService.findAll();
    res.render('inventario', { productos }); // Renderiza la vista 'inventario' con los datos del modelo
  }

  @Get('products')
  async mostrarProductos(@Res() res: any): Promise<void> {
    const productos = await this.productoService.findAll();
    res.render('index', { producto: productos, mostrarProductos: true });
  }

  @Get('sales')
  async mostrarVentas(@Res() res: any): Promise<void> {
    const productos = await this.productoService.findAll();
    res.render('index', { producto: productos, mostrarVentas: true });
  }
}
