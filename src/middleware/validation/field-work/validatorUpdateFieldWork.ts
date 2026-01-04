import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { WorkType } from '../../../orm/entities/field-work/types';

export const validatorUpdateFieldWork = async (req: Request, res: Response, next: NextFunction) => {
  const { crop_id, employee_id, machinery_id, work_type, work_start_date, work_end_date } = req.body;
  const errorsValidation: string[] = [];
  
  let hasAnyField = false;

  if (crop_id !== undefined) {
    hasAnyField = true;
    if (isNaN(Number(crop_id))) {
      errorsValidation.push('crop_id: Crop ID must be a number');
    } else if (Number(crop_id) <= 0) {
      errorsValidation.push('crop_id: Crop ID must be greater than 0');
    } else {
      req.body.crop_id = parseInt(crop_id);
    }
  }

  if (employee_id !== undefined) {
    hasAnyField = true;
    if (isNaN(Number(employee_id))) {
      errorsValidation.push('employee_id: Employee ID must be a number');
    } else {
      req.body.employee_id = parseInt(employee_id);
    }
  }

  if (machinery_id !== undefined) {
    hasAnyField = true;
    if (isNaN(Number(machinery_id))) {
      errorsValidation.push('machinery_id: Machinery ID must be a number');
    } else {
      req.body.machinery_id = parseInt(machinery_id);
    }
  }

  if (work_type !== undefined) {
    hasAnyField = true;
    if (!Object.values(WorkType).includes(work_type)) {
      errorsValidation.push(`work_type: Work type must be one of: ${Object.values(WorkType).join(', ')}`);
    }
  }

  if (work_start_date !== undefined) {
    hasAnyField = true;
    if (isNaN(Date.parse(work_start_date))) {
      errorsValidation.push('work_start_date: Start date must be a valid date (YYYY-MM-DD)');
    } else {
      req.body.work_start_date = new Date(work_start_date).toISOString().split('T')[0];
    }
  }

  if (work_end_date !== undefined) {
    hasAnyField = true;
    if (isNaN(Date.parse(work_end_date))) {
      errorsValidation.push('work_end_date: End date must be a valid date (YYYY-MM-DD)');
    } else {
      req.body.work_end_date = new Date(work_end_date).toISOString().split('T')[0];
    }
  }

  if (work_start_date && work_end_date && Date.parse(work_end_date) <= Date.parse(work_start_date)) {
    errorsValidation.push('work_end_date: End date must be after start date');
  }

  if (!hasAnyField) {
    errorsValidation.push('general: At least one field must be provided for update');
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Update field work validation error', errorsValidation);
    return next(customError);
  }

  next();
};