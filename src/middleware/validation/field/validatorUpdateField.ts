import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { SoilType } from '../../../orm/entities/fields/types';

export const validatorUpdateField = async (req: Request, res: Response, next: NextFunction) => {
  const { area_hectares, soil_type, field_location } = req.body;
  const errorsValidation: string[] = [];
  
  let hasAnyField = false;

  if (area_hectares !== undefined) {
    hasAnyField = true;
    if (isNaN(Number(area_hectares))) {
      errorsValidation.push('area_hectares: Area must be a number');
    } else if (Number(area_hectares) <= 0) {
      errorsValidation.push('area_hectares: Area must be greater than 0');
    } else {
      req.body.area_hectares = parseFloat(area_hectares);
    }
  }

  if (soil_type !== undefined) {
    hasAnyField = true;
    if (!Object.values(SoilType).includes(soil_type)) {
      errorsValidation.push(`soil_type: Soil type must be one of: ${Object.values(SoilType).join(', ')}`);
    }
  }

  if (field_location !== undefined) {
    hasAnyField = true;
    if (typeof field_location !== 'string') {
      errorsValidation.push('field_location: Field location must be a string');
    } else if (field_location.trim().length === 0) {
      errorsValidation.push('field_location: Field location cannot be empty');
    } else if (field_location.length > 20) {
      errorsValidation.push('field_location: Field location must be 20 characters or less');
    }
  }

  if (!hasAnyField) {
    errorsValidation.push('general: At least one field must be provided for update');
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Update field validation error', errorsValidation);
    return next(customError);
  }

  next();
};