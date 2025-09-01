import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { jwtConstants } from './constants';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<LoginResponse> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...rest } = user;
    const match = await bcrypt.compare(pass, password);
    if (!match) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.jwtService.signAsync(rest),
      refreshToken: await this.jwtService.signAsync(rest, { expiresIn: '7d' }),
      user: rest,
    };
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
  ): Promise<LoginResponse> {
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new BadRequestException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.create(
      email,
      hashedPassword,
      fullName,
    );

    // After creating the user then sign in
    const signInResult = await this.signIn(newUser.email, password);
    return signInResult;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const payload = await this.jwtService.verifyAsync<LoginResponse['user']>(
      refreshToken,
      {
        secret: jwtConstants.secret,
      },
    );
    const user = await this.usersService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.signIn(user.email, user.password);
  }
}
