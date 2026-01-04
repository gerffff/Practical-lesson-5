import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { SoilType } from './types';
import { Crop } from '../crop/Crop';

@Entity('field')
export class Field {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  field_name: string;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 3,
    nullable: false 
  })
  area_hectares: number;

  @Column({ 
    type: 'enum', 
    enum: SoilType,
    nullable: false 
  })
  soil_type: SoilType;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    unique: true,
    nullable: false 
  })
  field_location: string;

  @OneToMany(() => Crop, crop => crop.field)
  crops: Crop[];
}