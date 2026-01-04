import { Request, Response, NextFunction } from 'express';
import { FieldWorkService } from '../../services/field-work.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { FieldWorkResponseDTO } from '../../dto/field-work/FieldWorkResponseDTO';

const fieldWorkService = new FieldWorkService();

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const workId = parseInt(id);

  if (isNaN(workId)) {
    const customError = new CustomError(400, 'General', 'Invalid field work ID');
    return next(customError);
  }

  try {
    const withRelations = req.query.withRelations === 'true';

    const fieldWorkService = new FieldWorkService();
    const fieldWorkEntity = await fieldWorkService.findOne(workId, withRelations);

    if (!fieldWorkEntity) {
      const customError = new CustomError(404, 'General', `Field work with id:${workId} not found.`);
      return next(customError);
    }

    const fieldWorkResponseDTO = new FieldWorkResponseDTO(fieldWorkEntity, withRelations);

    res.customSuccess(200, 'Field work retrieved successfully', fieldWorkResponseDTO);
  } catch (err) {
    const customError = new CustomError(500, 'Raw', 'Error retrieving field work', null, err);
    return next(customError);
  }
};
