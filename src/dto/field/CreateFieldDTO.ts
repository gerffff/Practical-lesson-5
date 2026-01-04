import { SoilType } from '../../orm/entities/fields/types';

export interface CreateFieldDTO {
  field_name: string;
  area_hectares: number;
  soil_type: SoilType;
  field_location: string;
}
