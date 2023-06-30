import { HttpException, HttpStatus } from '@nestjs/common';

export class Password2InvalidoException extends HttpException {
  constructor() {
    super('Las contraseñas no coinciden', HttpStatus.BAD_REQUEST);
  }
}