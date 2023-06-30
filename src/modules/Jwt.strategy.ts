import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../services/UserService';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'yourSecretKey', // Cambia esto por tu clave secreta
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // Aquí puedes realizar una validación adicional del token si es necesario
    const user = await this.userService.loadUserByUsername(payload.username);
    return user;
  }
}
