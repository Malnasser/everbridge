import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (default: 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 10,
    minimum: 5,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter expression (e.g., field:value)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  filter?: string;

  @ApiPropertyOptional({
    description: 'Select specific fields (comma separated)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  select?: string;

  @ApiPropertyOptional({
    description: 'Sort expression (e.g., createdAt:desc)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sort?: string;
}
