import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(
    email: string,
    password: string,
    fullName: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: { email, password, fullName, tokenVersion: 0 },
    });
  }

  async updateTokenVersion(
    userId: User['id'],
    tokenVersion: User['tokenVersion'],
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { tokenVersion },
    });
  }
}
