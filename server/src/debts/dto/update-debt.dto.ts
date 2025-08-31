import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

import { CreateDebtDto } from './create-debt.dto';

export class UpdateDebtDto extends PartialType(CreateDebtDto) {
  @ApiPropertyOptional({
    example: 'Description of the debt',
    description: 'Description of the debt',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 10.0,
    description: 'Amount of the debt',
  })
  amount?: number;

  @ApiPropertyOptional({
    example: '2025-08-31',
    description: 'Due date of the debt',
  })
  dueDate?: Date;
}
