import { Request, Response, NextFunction } from 'express';
import { FieldService } from '../../services/field.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { FieldResponseDTO } from '../../dto/field/FieldResponseDTO';

const fieldService = new FieldService();

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { field_name } = req.params;

    const withCrops = req.query.withCrops === 'true';
    const forUpdate = req.query.forUpdate === 'true';

    const includeCrops = withCrops && !forUpdate;

    const fieldService = new FieldService();
    const fieldEntity = await fieldService.findOne(field_name, includeCrops);

    if (!fieldEntity) {
      const customError = new CustomError(404, 'General', `Field with name '${field_name}' not found.`);
      return next(customError);
    }

    const fieldResponseDTO = new FieldResponseDTO(fieldEntity, includeCrops);

    res.customSuccess(200, 'Field retrieved successfully', fieldResponseDTO);
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }
    const customError = new CustomError(500, 'Raw', 'Error retrieving field', null, error);
    return next(customError);
  }
};
