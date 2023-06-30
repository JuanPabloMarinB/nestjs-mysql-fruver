import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/Usuario.entity';
import * as bcrypt from 'bcrypt';
import { NombreInvalidoException } from '../exceptions/user/NombreInvalidoException';
import { ApellidoInvalidoException } from '../exceptions/user/ApellidoInvalidoException';
import { EmailInvalidoException } from '../exceptions/user/EmailInvalidoException';
import { PasswordInvalidoException } from '../exceptions/user/PasswordInvalidoException';
import { Password2InvalidoException } from '../exceptions/user/Password2InvalidoException';
import { Rol } from '../enums/Rol';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario)
    private userRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.userRepository.find();
  }

  async getById(id: number): Promise<Usuario> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(user: Usuario): Promise<void> {
    await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async save(user: Usuario): Promise<Usuario> {
    return this.userRepository.save(user);
  }

  async registrar(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    password2: string,
  ): Promise<void> {
    this.validar(nombre, apellido, email, password, password2);
    const usuario = new Usuario();
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.email = email;
    usuario.password = await bcrypt.hash(password, 10);
    usuario.rol = Rol.USER;
    await this.userRepository.save(usuario);
  }

  private validar(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    password2: string,
  ): void {
    if (!nombre || nombre.trim() === '') {
      throw new NombreInvalidoException();
    }

    if (!apellido || apellido.trim() === '') {
      throw new ApellidoInvalidoException();
    }

    if (!email || email.trim() === '') {
      throw new EmailInvalidoException();
    }

    if (!password || password.length <= 5) {
      throw new PasswordInvalidoException();
    }

    if (password !== password2) {
      throw new Password2InvalidoException();
    }
  }

  async loadUserByUsername(username: string): Promise<JwtPayload> {
    const user = await this.userRepository.findOne({
      where: { email: username },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const userDetails: JwtPayload = {
      sub: user.id.toString(),
      username: user.nombre,
      roles: user.rol,
    };

    return userDetails;
  }
}
