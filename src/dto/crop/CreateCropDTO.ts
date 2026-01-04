import { CropStatus } from '../../orm/entities/crop/types';

export interface CreateCropDTO {
  field_name: string;
  cultivated_plant_name: string;
  crop_start_date: string;
  crop_harvest_date: string;
  actual_harvest_tons: number;
  crop_status: CropStatus;
}
