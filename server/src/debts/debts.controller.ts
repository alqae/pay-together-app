import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';

import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { DebtsService } from './debts.service';
import { AuthGuard } from '../auth/auth.guard';
import { exampleDebt } from './constants';
import { User } from '@prisma/client';

@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, schema: { example: exampleDebt } })
  @Post()
  create(
    @Body() createDebtDto: CreateDebtDto,
    @Request() req: Request & { user: User },
  ) {
    return this.debtsService.create(createDebtDto, req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'array', items: { example: exampleDebt } },
  })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ name: 'paid', required: false, type: Boolean })
  findAll(
    @Request() req: Request & { user: User },
    @Query('description') description?: string,
    @Query('paid') paid?: boolean,
  ) {
    return this.debtsService.findAll(req.user.id, description, paid);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, schema: { example: exampleDebt } })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @Patch(':id/toggle-paid')
  async togglePaid(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
  ) {
    const debt = await this.debtsService.findOne(+id);

    if (!debt) {
      return new NotFoundException();
    }

    if (debt.userId !== req.user.id) {
      return new UnauthorizedException();
    }

    return this.debtsService.setPaid(+id, !debt.paid);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, schema: { example: exampleDebt } })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
    @Request() req: Request & { user: User },
  ) {
    const debt = await this.debtsService.findOne(+id);

    if (!debt) {
      return new NotFoundException();
    }

    if (debt.userId !== req.user.id) {
      return new UnauthorizedException();
    }

    return this.debtsService.update(+id, updateDebtDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, schema: { example: exampleDebt } })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
  ) {
    const debt = await this.debtsService.findOne(+id);

    if (!debt) {
      return new NotFoundException();
    }

    if (debt.userId !== req.user.id) {
      return new UnauthorizedException();
    }

    return this.debtsService.remove(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/export')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'CSV file successfully generated',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not debts found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ name: 'paid', required: false, type: Boolean })
  async exportToCSV(
    @Request() req: Request & { user: User },
    @Res() res: Response,
    @Query('description') description?: string,
    @Query('paid') paid?: boolean,
  ) {
    const debts = await this.debtsService.findAll(
      req.user.id,
      description,
      paid,
    );

    if (debts.length === 0) {
      throw new NotFoundException();
    }

    return this.debtsService.generateCsv(debts, res);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        pendingBalance: 0,
        paidDebts: 0,
      },
    },
  })
  @Get('/counters')
  async getDebtsCounters(@Request() req: Request & { user: User }) {
    return this.debtsService.countDebts(req.user.id);
  }
}
