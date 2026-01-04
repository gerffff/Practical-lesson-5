import { WorkType } from '../../orm/entities/field-work/types';

export interface CreateFieldWorkDTO {
  crop_id: number;
  employee_id: number;
  machinery_id: number;
  work_type: WorkType;
  work_start_date: string;
  work_end_date: string;
}