import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordInvalidoException extends HttpException {
  constructor() {
    super('La contraseña no puede ser nula o estar vacía, además debe tener más de 5 dígitos', HttpStatus.BAD_REQUEST);
  }
}