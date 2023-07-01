import {
  Controller,
  Get,
  Post,
  Req,
  Session,
  Res,
  Render,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../modules/Jwt-auth.guard';
import { Usuario } from '../entities/Usuario.entity';
import { UserService } from '../services/UserService';
import { NombreInvalidoException } from '../exceptions/user/NombreInvalidoException';
import { ApellidoInvalidoException } from '../exceptions/user/ApellidoInvalidoException';
import { EmailInvalidoException } from '../exceptions/user/EmailInvalidoException';
import { PasswordInvalidoException } from '../exceptions/user/PasswordInvalidoException';
import { Password2InvalidoException } from '../exceptions/user/Password2InvalidoException';

@Controller('usuario')
export class userController {
  constructor(private readonly usuarioServicio: UserService) {}

  @Get('/')
  @Render('inicio') // Renderiza la vista 'inicio' con los datos del modelo
  index(): void {
    // No es necesario retornar nada, ya que @Render manejará la renderización de la vista
  }

  @Get('/registro')
  @Render('registro') // Renderiza la vista 'registro' con los datos del modelo
  register(): void {
    // No es necesario retornar nada, ya que @Render manejará la renderización de la vista
  }

  @Post('/registro')
  @Render('registro') // Renderiza la vista 'registro' con los datos del modelo
  async registrarUsuario(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<{
    errorNombre: string;
    errorApellido: string;
    errorEmail: string;
    errorPassword: string;
    errorPassword2: string;
    error: string;
  }> {
    const { nombre, apellido, email, password, password2 } = req.body;
    try {
      await this.usuarioServicio.registrar(
        nombre,
        apellido,
        email,
        password,
        password2,
      );
      res.redirect('/inicio');
    } catch (error) {
      const model = {
        errorNombre: '',
        errorApellido: '',
        errorEmail: '',
        errorPassword: '',
        errorPassword2: '',
        error: 'Error al registrar usuario',
      };
      if (error instanceof NombreInvalidoException) {
        model.errorNombre = 'El nombre es inválido';
      } else if (error instanceof ApellidoInvalidoException) {
        model.errorApellido = 'El apellido es inválido';
      } else if (error instanceof EmailInvalidoException) {
        model.errorEmail = 'El email es inválido';
      } else if (error instanceof PasswordInvalidoException) {
        model.errorPassword = 'La contraseña es inválida';
      } else if (error instanceof Password2InvalidoException) {
        model.errorPassword2 = 'Las contraseñas no coinciden';
      }
      return model;
    }
  }

  @Get('/login')
  @Render('login') // Renderiza la vista 'login' con los datos del modelo
  login(@Req() req: Request): { error: string } {
    const { error } = req.query;
    const model = { error: '' };
    if (error) {
      model.error = 'Usuario o contraseña inválidos';
    }
    return model;
  }

  @Get('/inicio')
  @UseGuards(JwtAuthGuard) // Aplica el guardia de autenticación para proteger este endpoint
  inicio(@Session() session: Record<string, any>, @Res() res: Response): void {
    const logueado = session.usuariosession as Usuario;
    console.log(logueado.getRol());
    if (logueado.getRol().toString() === 'ADMIN') {
      res.redirect('/dashboard');
    } else if (logueado.getRol().toString() === 'AUTOR') {
      res.redirect('/autorPortal');
    } else {
      res.redirect('/portal');
    }
  }
}
