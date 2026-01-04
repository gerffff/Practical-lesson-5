import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { SoilType } from '../../../orm/entities/fields/types';

export const validatorCreateField = async (req: Request, res: Response, next: NextFunction) => {
  const { field_name, area_hectares, soil_type, field_location } = req.body;
  const errorsValidation: string[] = [];

  if (!field_name || typeof field_name !== 'string') {
    errorsValidation.push('field_name: Field name is required and must be a string');
  } else if (field_name.trim().length === 0) {
    errorsValidation.push('field_name: Field name cannot be empty');
  } else if (field_name.length > 20) {
    errorsValidation.push('field_name: Field name must be 20 characters or less');
  }

  if (!area_hectares && area_hectares !== 0) {
    errorsValidation.push('area_hectares: Area in hectares is required');
  } else if (isNaN(Number(area_hectares))) {
    errorsValidation.push('area_hectares: Area must be a number');
  } else if (Number(area_hectares) <= 0) {
    errorsValidation.push('area_hectares: Area must be greater than 0');
  }

  if (!soil_type) {
    errorsValidation.push('soil_type: Soil type is required');
  } else if (!Object.values(SoilType).includes(soil_type)) {
    errorsValidation.push(`soil_type: Soil type must be one of: ${Object.values(SoilType).join(', ')}`);
  }

  if (!field_location || typeof field_location !== 'string') {
    errorsValidation.push('field_location: Field location is required and must be a string');
  } else if (field_location.trim().length === 0) {
    errorsValidation.push('field_location: Field location cannot be empty');
  } else if (field_location.length > 20) {
    errorsValidation.push('field_location: Field location must be 20 characters or less');
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Create field validation error', errorsValidation);
    return next(customError);
  }

  req.body.area_hectares = parseFloat(area_hectares);
  next();
};