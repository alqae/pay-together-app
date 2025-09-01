import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { exampleLoginSuccess, exampleUser } from './constants';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: exampleLoginSuccess },
  })
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    description: 'User already exists',
    type: BadRequestException,
    example: new BadRequestException().getResponse(),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: exampleLoginSuccess },
  })
  @Post('register')
  signUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(
      registerDto.email,
      registerDto.password,
      registerDto.fullName,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    type: BadRequestException,
    example: new BadRequestException().getResponse(),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: exampleLoginSuccess },
  })
  @Post('refresh')
  refreshToken(@Request() req: Request & { user: User }) {
    const header = req.headers['Refresh-Token'] as string | undefined;
    if (!header) {
      throw new BadRequestException();
    }
    return this.authService.refreshToken(header);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({ status: HttpStatus.OK, schema: { example: exampleUser } })
  @ApiBearerAuth('access-token')
  @Post('whoami')
  whoAmI(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
