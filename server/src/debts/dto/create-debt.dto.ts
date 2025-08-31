import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDebtDto {
  @ApiProperty({ example: 10.0, description: 'Amount of the debt' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'Description of the debt',
    description: 'Description of the debt',
  })
  @IsString()
  description: string;

  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    example: '2025-08-31',
    description: 'Due date of the debt',
  })
  @IsDate()
  dueDate: Date;
}
