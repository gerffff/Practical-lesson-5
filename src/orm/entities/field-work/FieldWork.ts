import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WorkType } from './types';
import { Crop } from '../crop/Crop';

@Entity('field_work')
export class FieldWork {
  @PrimaryGeneratedColumn()
  work_id: number;

  @ManyToOne(() => Crop, crop => crop.crop_id)
  @JoinColumn({ name: 'crop_id' })
  crop: Crop;

  @Column({ type: 'integer', nullable: false })
  employee_id: number;

  @Column({ type: 'integer', nullable: false })
  machinery_id: number;

  @Column({ 
    type: 'enum', 
    enum: WorkType,
    nullable: false 
  })
  work_type: WorkType;

  @Column({ type: 'date', nullable: false })
  work_start_date: Date;

  @Column({ type: 'date', nullable: false })
  work_end_date: Date;
}