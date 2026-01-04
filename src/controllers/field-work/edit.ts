import { Request, Response, NextFunction } from 'express';
import { FieldWorkService } from '../../services/field-work.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { UpdateFieldWorkDTO } from '../../dto/field-work/UpdateFieldWorkDTO';
import { FieldWorkResponseDTO } from '../../dto/field-work/FieldWorkResponseDTO';

const fieldWorkService = new FieldWorkService();

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const workId = parseInt(id);
  const { crop_id, employee_id, machinery_id, work_type, work_start_date, work_end_date } = req.body;

  if (isNaN(workId)) {
    const customError = new CustomError(400, 'General', 'Invalid field work ID');
    return next(customError);
  }

  try {
    const fieldWorkEntity = await fieldWorkService.findOne(workId, false);

    if (!fieldWorkEntity) {
      const customError = new CustomError(404, 'General', `Field work with id:${workId} not found.`);
      return next(customError);
    }

    const updateData: UpdateFieldWorkDTO = {};
    if (crop_id !== undefined) updateData.crop_id = parseInt(crop_id);
    if (employee_id !== undefined) updateData.employee_id = parseInt(employee_id);
    if (machinery_id !== undefined) updateData.machinery_id = parseInt(machinery_id);
    if (work_type !== undefined) updateData.work_type = work_type;
    if (work_start_date !== undefined) updateData.work_start_date = work_start_date;
    if (work_end_date !== undefined) updateData.work_end_date = work_end_date;

    if (Object.keys(updateData).length === 0) {
      const customError = new CustomError(400, 'General', 'No fields to update');
      return next(customError);
    }

    const updatedFieldWorkEntity = await fieldWorkService.update(workId, updateData);

    if (!updatedFieldWorkEntity) {
      const customError = new CustomError(404, 'General', `Field work with id:${workId} not found.`);
      return next(customError);
    }

    const fieldWorkResponseDTO = new FieldWorkResponseDTO(updatedFieldWorkEntity, true);

    res.customSuccess(200, 'Field work updated successfully', fieldWorkResponseDTO);
  } catch (err) {
    if (err.message.includes('not found')) {
      const customError = new CustomError(404, 'General', err.message);
      return next(customError);
    }

    const customError = new CustomError(500, 'Raw', 'Error updating field work', null, err);
    return next(customError);
  }
};
