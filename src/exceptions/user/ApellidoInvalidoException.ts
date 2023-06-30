import { HttpException, HttpStatus } from '@nestjs/common';

export class ApellidoInvalidoException extends HttpException {
  constructor() {
    super('El apellido no puede ser nulo o estar vacío', HttpStatus.BAD_REQUEST);
  }
}