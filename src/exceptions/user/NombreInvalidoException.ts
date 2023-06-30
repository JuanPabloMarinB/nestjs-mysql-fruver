import { HttpException, HttpStatus } from '@nestjs/common';

export class NombreInvalidoException extends HttpException {
  constructor() {
    super('El nombre no puede ser nulo o estar vacío', HttpStatus.BAD_REQUEST);
  }
}