import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
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
      access_token: await this.jwtService.signAsync(rest),
    };
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ access_token: string }> {
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
}
