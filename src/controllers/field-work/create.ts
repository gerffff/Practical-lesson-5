import { Request, Response, NextFunction } from 'express';
import { FieldWorkService } from '../../services/field-work.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CreateFieldWorkDTO } from '../../dto/field-work/CreateFieldWorkDTO';
import { FieldWorkResponseDTO } from '../../dto/field-work/FieldWorkResponseDTO';

const fieldWorkService = new FieldWorkService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { crop_id, employee_id, machinery_id, work_type, work_start_date, work_end_date } = req.body;

  if (!crop_id || !employee_id || !machinery_id || !work_type || !work_start_date || !work_end_date) {
    const customError = new CustomError(400, 'General', 'All fields are required');
    return next(customError);
  }

  try {
    const createFieldWorkDto: CreateFieldWorkDTO = {
      crop_id: parseInt(crop_id),
      employee_id: parseInt(employee_id),
      machinery_id: parseInt(machinery_id),
      work_type: work_type as any,
      work_start_date,
      work_end_date,
    };

    const fieldWorkEntity = await fieldWorkService.create(createFieldWorkDto);
    const fieldWorkResponseDTO = new FieldWorkResponseDTO(fieldWorkEntity, false);

    res.customSuccess(201, 'Field work created successfully', fieldWorkResponseDTO);
  } catch (err) {
    if (err.message.includes('not found')) {
      const customError = new CustomError(404, 'General', err.message);
      return next(customError);
    }

    const customError = new CustomError(500, 'Raw', 'Error creating field work', null, err);
    return next(customError);
  }
};
