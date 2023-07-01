import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './Jwt.strategy';
import { UserService } from '../services/UserService';
import { JwtAuthGuard } from './Jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'yourSecretKey', // Cambia esto por tu clave secreta
      signOptions: { expiresIn: '1d' }, // Cambia esto según tus necesidades
    }),
  ],
  providers: [UserService, JwtStrategy, JwtAuthGuard, JwtService],
  exports: [PassportModule],
})
export class SecurityModule {}
