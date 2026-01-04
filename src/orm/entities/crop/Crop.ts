import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CropStatus } from './types';
import { Field } from '../fields/Field';
import { FieldWork } from '../field-work/FieldWork';

@Entity('crop')
export class Crop {
  @PrimaryGeneratedColumn()
  crop_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  field_name: string; 

  @ManyToOne(() => Field, field => field.field_name)
  @JoinColumn({ name: 'field_name' })
  field: Field;

  @Column({ type: 'varchar', length: 20, nullable: false })
  cultivated_plant_name: string;

  @Column({ type: 'date', nullable: false })
  crop_start_date: Date;

  @Column({ type: 'date', nullable: false })
  crop_harvest_date: Date;

  @Column({ type: 'smallint', nullable: false })
  actual_harvest_tons: number;

  @Column({ 
    type: 'enum', 
    enum: CropStatus,
    nullable: false 
  })
  crop_status: CropStatus;

  @OneToMany(() => FieldWork, fieldWork => fieldWork.crop)
  fieldWorks: FieldWork[];
}