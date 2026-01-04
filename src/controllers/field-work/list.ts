import { Request, Response, NextFunction } from 'express';
import { FieldWorkService } from '../../services/field-work.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { FieldWorkResponseDTO } from '../../dto/field-work/FieldWorkResponseDTO';

const fieldWorkService = new FieldWorkService();

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const withRelations = req.query.withRelations === 'true';

    const fieldWorkEntities = await fieldWorkService.findAll(withRelations);

    const fieldWorkResponseDTOs = fieldWorkEntities.map(
      (fieldWork) => new FieldWorkResponseDTO(fieldWork, withRelations),
    );

    res.customSuccess(200, 'Field works retrieved successfully', fieldWorkResponseDTOs);
  } catch (error) {
    const customError = new CustomError(500, 'Raw', 'Error retrieving field works', null, error);
    return next(customError);
  }
};
