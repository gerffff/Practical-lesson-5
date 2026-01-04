import { Request, Response, NextFunction } from 'express';
import { CropService } from '../../services/crop.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CropResponseDTO } from '../../dto/crop/CropResponseDTO';

const cropService = new CropService();

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const withRelations = req.query.withRelations === 'true';

    const cropEntities = await cropService.findAll(withRelations);

    const cropResponseDTOs = cropEntities.map((crop) => new CropResponseDTO(crop, withRelations));

    res.customSuccess(200, 'Crops retrieved successfully', cropResponseDTOs);
  } catch (error) {
    const customError = new CustomError(500, 'Raw', 'Error retrieving crops', null, error);
    return next(customError);
  }
};
