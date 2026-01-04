import { Field } from '../../orm/entities/fields/Field';
import { SoilType } from '../../orm/entities/fields/types';
import { Crop } from '../../orm/entities/crop/Crop';
import { CropStatus } from '../../orm/entities/crop/types';

export class FieldResponseDTO {
  field_name: string;
  area_hectares: number;
  soil_type: SoilType;
  field_location: string;
  crops?: Array<{
    crop_id: number;
    cultivated_plant_name: string;
    crop_start_date: Date;
    crop_harvest_date: Date;
    actual_harvest_tons: number;
    crop_status: CropStatus;
  }>;

  constructor(field: Field, includeCrops: boolean = false) {
    this.field_name = field.field_name;
    this.area_hectares = parseFloat(field.area_hectares.toString());
    this.soil_type = field.soil_type;
    this.field_location = field.field_location;

    if (includeCrops && field.crops) {
      this.crops = field.crops.map((crop: Crop) => ({
        crop_id: crop.crop_id,
        cultivated_plant_name: crop.cultivated_plant_name,
        crop_start_date: crop.crop_start_date,
        crop_harvest_date: crop.crop_harvest_date,
        actual_harvest_tons: crop.actual_harvest_tons,
        crop_status: crop.crop_status,
      }));
    }
  }
}