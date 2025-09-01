import { User } from '@prisma/client';

export const jwtConstants = {
  secret: process.env.ACCESS_TOKEN_SECRET,
};

export const exampleUser = {
  id: 0,
  email: 'your_email',
  fullName: 'your_full_name',
  tokenVersion: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
} as Omit<User, 'password'>;

export const exampleLoginSuccess = {
  accessToken: 'your_access_token',
  refreshToken: 'your_refresh_token',
};
