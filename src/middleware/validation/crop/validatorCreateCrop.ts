import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { CropStatus } from '../../../orm/entities/crop/types';

export const validatorCreateCrop = async (req: Request, res: Response, next: NextFunction) => {
  const { field_name, cultivated_plant_name, crop_start_date, crop_harvest_date, actual_harvest_tons, crop_status } = req.body;
  const errorsValidation: string[] = [];

  if (!field_name || typeof field_name !== 'string') {
    errorsValidation.push('field_name: Field name is required and must be a string');
  }

  if (!cultivated_plant_name || typeof cultivated_plant_name !== 'string') {
    errorsValidation.push('cultivated_plant_name: Plant name is required and must be a string');
  } else if (cultivated_plant_name.length > 20) {
    errorsValidation.push('cultivated_plant_name: Plant name must be 20 characters or less');
  }

  if (!crop_start_date) {
    errorsValidation.push('crop_start_date: Start date is required');
  } else if (isNaN(Date.parse(crop_start_date))) {
    errorsValidation.push('crop_start_date: Start date must be a valid date (YYYY-MM-DD)');
  }

  if (!crop_harvest_date) {
    errorsValidation.push('crop_harvest_date: Harvest date is required');
  } else if (isNaN(Date.parse(crop_harvest_date))) {
    errorsValidation.push('crop_harvest_date: Harvest date must be a valid date (YYYY-MM-DD)');
  } else if (Date.parse(crop_harvest_date) <= Date.parse(crop_start_date)) {
    errorsValidation.push('crop_harvest_date: Harvest date must be after start date');
  }

  if (!actual_harvest_tons && actual_harvest_tons !== 0) {
    errorsValidation.push('actual_harvest_tons: Harvest amount is required');
  } else if (isNaN(Number(actual_harvest_tons))) {
    errorsValidation.push('actual_harvest_tons: Harvest amount must be a number');
  } else if (Number(actual_harvest_tons) < 0) {
    errorsValidation.push('actual_harvest_tons: Harvest amount cannot be negative');
  }

  if (!crop_status) {
    errorsValidation.push('crop_status: Crop status is required');
  } else if (!Object.values(CropStatus).includes(crop_status)) {
    errorsValidation.push(`crop_status: Crop status must be one of: ${Object.values(CropStatus).join(', ')}`);
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Create crop validation error', errorsValidation);
    return next(customError);
  }

  req.body.actual_harvest_tons = parseInt(actual_harvest_tons);
  req.body.crop_start_date = new Date(crop_start_date).toISOString().split('T')[0];
  req.body.crop_harvest_date = new Date(crop_harvest_date).toISOString().split('T')[0];
  
  next();
};