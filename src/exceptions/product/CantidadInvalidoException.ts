import { HttpException, HttpStatus } from '@nestjs/common';

export class CantidadInvalidoException extends HttpException {
  constructor() {
    super('La cantidad no puede ser nula o estar vacía', HttpStatus.BAD_REQUEST);
  }
}