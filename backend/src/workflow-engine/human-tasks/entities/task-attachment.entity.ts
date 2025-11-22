import { BaseEntity } from '@common/database/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { HumanTask } from './human-task.entity';
import { Upload } from '@core/uploader/entities/upload.entity';

@Entity('task_attachments')
export class TaskAttachment extends BaseEntity {
  @ManyToOne(() => Upload, { nullable: true })
  @JoinColumn({ name: 'uploadId' })
  upload: Upload;

  @Column({ nullable: true })
  uploadId?: string;

  @ManyToOne(() => HumanTask, (humanTask) => humanTask.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'humanTaskId' })
  humanTask: HumanTask;

  @Column()
  humanTaskId: string;

  @Column()
  fieldKey: string;

  @Column({ nullable: true })
  notes?: string;
}
