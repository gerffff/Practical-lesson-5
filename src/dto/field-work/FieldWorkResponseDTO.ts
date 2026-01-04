import { FieldWork } from '../../orm/entities/field-work/FieldWork';
import { WorkType } from '../../orm/entities/field-work/types';
import { Crop } from '../../orm/entities/crop/Crop';
import { CropStatus } from '../../orm/entities/crop/types';

export class FieldWorkResponseDTO {
  work_id: number;
  crop_id: number;
  employee_id: number;
  machinery_id: number;
  work_type: WorkType;
  work_start_date: Date;
  work_end_date: Date;
  crop?: {
    crop_id: number;
    field_name: string;
    cultivated_plant_name: string;
    crop_start_date: Date;
    crop_harvest_date: Date;
    actual_harvest_tons: number;
    crop_status: CropStatus;
  };

  constructor(fieldWork: FieldWork, includeCrop: boolean = false) {
    this.work_id = fieldWork.work_id;
    this.crop_id = fieldWork.crop.crop_id;
    this.employee_id = fieldWork.employee_id;
    this.machinery_id = fieldWork.machinery_id;
    this.work_type = fieldWork.work_type;
    this.work_start_date = fieldWork.work_start_date;
    this.work_end_date = fieldWork.work_end_date;

    if (includeCrop && fieldWork.crop && fieldWork.crop.field) {
      this.crop = {
        crop_id: fieldWork.crop.crop_id,
        field_name: fieldWork.crop.field.field_name,
        cultivated_plant_name: fieldWork.crop.cultivated_plant_name,
        crop_start_date: fieldWork.crop.crop_start_date,
        crop_harvest_date: fieldWork.crop.crop_harvest_date,
        actual_harvest_tons: fieldWork.crop.actual_harvest_tons,
        crop_status: fieldWork.crop.crop_status,
      };
    }
  }
}