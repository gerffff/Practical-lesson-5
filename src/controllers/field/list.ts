import { Request, Response, NextFunction } from 'express';
import { FieldService } from '../../services/field.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { FieldResponseDTO } from '../../dto/field/FieldResponseDTO';

const fieldService = new FieldService();

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const withCrops = req.query.withCrops === 'true';

    const fieldEntities = await fieldService.findAll(withCrops);

    const fieldResponseDTOs = fieldEntities.map((field) => new FieldResponseDTO(field, withCrops));

    res.customSuccess(200, 'Fields retrieved successfully', fieldResponseDTOs);
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }
    const customError = new CustomError(500, 'Raw', 'Error retrieving fields', null, error);
    return next(customError);
  }
};
