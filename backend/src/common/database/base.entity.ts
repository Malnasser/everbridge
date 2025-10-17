import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({ example: 'c6acbc14-113c-4014-a717-3d67acd36ad9' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2025-09-04T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-09-04T12:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'user-id-of-creator', nullable: true })
  @Column({ nullable: true })
  createdBy?: string;

  @ApiProperty({ example: 'user-id-of-updater', nullable: true })
  @Column({ nullable: true })
  updatedBy?: string;
}
