import { HttpException, HttpStatus } from '@nestjs/common';

export class FechaInvalidoException extends HttpException {
  constructor() {
    super('La fecha no puede ser nula o estar vací, además, debe tener un fprmato válido', HttpStatus.BAD_REQUEST);
  }
}