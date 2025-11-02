import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class PaginationRes<T> {
  @ApiProperty({
    description: 'Items',
  })
  @Type(() => Array)
  data: T[];

  @ApiProperty({
    description: 'Total number of items',
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  total: number;
  @ApiProperty({
    description: 'Current page number',
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  page: number;
  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    minimum: 5,
    maximum: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @Min(5)
  @Max(100)
  limit: number;
}
