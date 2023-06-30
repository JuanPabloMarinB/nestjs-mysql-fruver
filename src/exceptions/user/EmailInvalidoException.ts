import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailInvalidoException extends HttpException {
  constructor() {
    super('El email no puede ser nulo o estar vacío', HttpStatus.BAD_REQUEST);
  }
}