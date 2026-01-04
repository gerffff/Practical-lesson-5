import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { WorkType } from '../../../orm/entities/field-work/types';

export const validatorCreateFieldWork = async (req: Request, res: Response, next: NextFunction) => {
  const { crop_id, employee_id, machinery_id, work_type, work_start_date, work_end_date } = req.body;
  const errorsValidation: string[] = [];

  if (!crop_id && crop_id !== 0) {
    errorsValidation.push('crop_id: Crop ID is required');
  } else if (isNaN(Number(crop_id))) {
    errorsValidation.push('crop_id: Crop ID must be a number');
  } else if (Number(crop_id) <= 0) {
    errorsValidation.push('crop_id: Crop ID must be greater than 0');
  }

  if (!employee_id && employee_id !== 0) {
    errorsValidation.push('employee_id: Employee ID is required');
  } else if (isNaN(Number(employee_id))) {
    errorsValidation.push('employee_id: Employee ID must be a number');
  }

  if (!machinery_id && machinery_id !== 0) {
    errorsValidation.push('machinery_id: Machinery ID is required');
  } else if (isNaN(Number(machinery_id))) {
    errorsValidation.push('machinery_id: Machinery ID must be a number');
  }

  if (!work_type) {
    errorsValidation.push('work_type: Work type is required');
  } else if (!Object.values(WorkType).includes(work_type)) {
    errorsValidation.push(`work_type: Work type must be one of: ${Object.values(WorkType).join(', ')}`);
  }

  if (!work_start_date) {
    errorsValidation.push('work_start_date: Work start date is required');
  } else if (isNaN(Date.parse(work_start_date))) {
    errorsValidation.push('work_start_date: Start date must be a valid date (YYYY-MM-DD)');
  }

  if (!work_end_date) {
    errorsValidation.push('work_end_date: Work end date is required');
  } else if (isNaN(Date.parse(work_end_date))) {
    errorsValidation.push('work_end_date: End date must be a valid date (YYYY-MM-DD)');
  } else if (Date.parse(work_end_date) <= Date.parse(work_start_date)) {
    errorsValidation.push('work_end_date: End date must be after start date');
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Create field work validation error', errorsValidation);
    return next(customError);
  }

  req.body.crop_id = parseInt(crop_id);
  req.body.employee_id = parseInt(employee_id);
  req.body.machinery_id = parseInt(machinery_id);
  req.body.work_start_date = new Date(work_start_date).toISOString().split('T')[0];
  req.body.work_end_date = new Date(work_end_date).toISOString().split('T')[0];
  
  next();
};