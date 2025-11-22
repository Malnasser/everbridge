import { BaseEntity } from '@common/database/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { HumanTaskSignal } from './human-task-signal.entity';
import { HumanTaskAuthorization } from './human-task-authorization.entity';
import { TaskAttachment } from './task-attachment.entity';

export enum HumanTaskStatus {
  READY = 'READY',
  CLAIMED = 'CLAIMED',
  COMPLETED = 'COMPLETED',
}

@Entity('human_tasks')
export class HumanTask extends BaseEntity {
  @Column()
  businessProcessType: string;

  @Column()
  businessProcessId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: HumanTaskStatus,
    default: HumanTaskStatus.READY,
  })
  status: HumanTaskStatus;

  @Column({ type: 'jsonb' })
  schema: object;

  @Column({ type: 'jsonb', default: {} })
  formData: object;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: object;

  @OneToMany(() => HumanTaskSignal, (signal) => signal.humanTask)
  signals: HumanTaskSignal[];

  @OneToOne(() => HumanTaskAuthorization, (auth) => auth.humanTask)
  @JoinColumn()
  authorization: HumanTaskAuthorization;

  @OneToMany(() => TaskAttachment, (attachment) => attachment.humanTask)
  attachments: TaskAttachment[];
}
