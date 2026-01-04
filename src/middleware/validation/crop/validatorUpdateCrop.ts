import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { CropStatus } from '../../../orm/entities/crop/types';

export const validatorUpdateCrop = async (req: Request, res: Response, next: NextFunction) => {
  const { field_name, cultivated_plant_name, crop_start_date, crop_harvest_date, actual_harvest_tons, crop_status } = req.body;
  const errorsValidation: string[] = [];
  
  let hasAnyField = false;

  if (field_name !== undefined) {
    hasAnyField = true;
    if (typeof field_name !== 'string') {
      errorsValidation.push('field_name: Field name must be a string');
    } else if (field_name.trim().length === 0) {
      errorsValidation.push('field_name: Field name cannot be empty');
    }
  }

  if (cultivated_plant_name !== undefined) {
    hasAnyField = true;
    if (typeof cultivated_plant_name !== 'string') {
      errorsValidation.push('cultivated_plant_name: Plant name must be a string');
    } else if (cultivated_plant_name.length > 20) {
      errorsValidation.push('cultivated_plant_name: Plant name must be 20 characters or less');
    }
  }

  if (crop_start_date !== undefined) {
    hasAnyField = true;
    if (isNaN(Date.parse(crop_start_date))) {
      errorsValidation.push('crop_start_date: Start date must be a valid date (YYYY-MM-DD)');
    } else {
      req.body.crop_start_date = new Date(crop_start_date).toISOString().split('T')[0];
    }
  }

  if (crop_harvest_date !== undefined) {
    hasAnyField = true;
    if (isNaN(Date.parse(crop_harvest_date))) {
      errorsValidation.push('crop_harvest_date: Harvest date must be a valid date (YYYY-MM-DD)');
    } else {
      req.body.crop_harvest_date = new Date(crop_harvest_date).toISOString().split('T')[0];
    }
  }

  if (crop_start_date && crop_harvest_date && Date.parse(crop_harvest_date) <= Date.parse(crop_start_date)) {
    errorsValidation.push('crop_harvest_date: Harvest date must be after start date');
  }

  if (actual_harvest_tons !== undefined) {
    hasAnyField = true;
    if (isNaN(Number(actual_harvest_tons))) {
      errorsValidation.push('actual_harvest_tons: Harvest amount must be a number');
    } else if (Number(actual_harvest_tons) < 0) {
      errorsValidation.push('actual_harvest_tons: Harvest amount cannot be negative');
    } else {
      req.body.actual_harvest_tons = parseInt(actual_harvest_tons);
    }
  }

  if (crop_status !== undefined) {
    hasAnyField = true;
    if (!Object.values(CropStatus).includes(crop_status)) {
      errorsValidation.push(`crop_status: Crop status must be one of: ${Object.values(CropStatus).join(', ')}`);
    }
  }

  if (!hasAnyField) {
    errorsValidation.push('general: At least one field must be provided for update');
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Update crop validation error', errorsValidation);
    return next(customError);
  }

  next();
};