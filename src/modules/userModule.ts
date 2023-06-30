import { Module } from '@nestjs/common';
import { userController } from '../controllers/userController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repository/UserRepository';
import { Usuario } from '../entities/Usuario.entity';

@Module({
  controllers: [userController],
  providers: [UserService, UserRepository],
  imports: [Usuario],
})
export class userModule {}
