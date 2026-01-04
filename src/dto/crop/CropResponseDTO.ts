import { Crop } from '../../orm/entities/crop/Crop';
import { CropStatus } from '../../orm/entities/crop/types';
import { FieldWork } from '../../orm/entities/field-work/FieldWork';
import { WorkType } from '../../orm/entities/field-work/types';

export class CropResponseDTO {
  crop_id: number;
  field_name: string;
  cultivated_plant_name: string;
  crop_start_date: Date;
  crop_harvest_date: Date;
  actual_harvest_tons: number;
  crop_status: CropStatus;
  fieldWorks?: Array<{
    work_id: number;
    employee_id: number;
    machinery_id: number;
    work_type: WorkType;
    work_start_date: Date;
    work_end_date: Date;
  }>;

  constructor(crop: Crop, includeFieldWorks: boolean = false) {
    this.crop_id = crop.crop_id;
    this.field_name = crop.field.field_name;
    this.cultivated_plant_name = crop.cultivated_plant_name;
    this.crop_start_date = crop.crop_start_date;
    this.crop_harvest_date = crop.crop_harvest_date;
    this.actual_harvest_tons = crop.actual_harvest_tons;
    this.crop_status = crop.crop_status;

    if (includeFieldWorks && crop.fieldWorks) {
      this.fieldWorks = crop.fieldWorks.map((work: FieldWork) => ({
        work_id: work.work_id,
        employee_id: work.employee_id,
        machinery_id: work.machinery_id,
        work_type: work.work_type,
        work_start_date: work.work_start_date,
        work_end_date: work.work_end_date,
      }));
    }
  }
}