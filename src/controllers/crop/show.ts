import { Request, Response, NextFunction } from 'express';
import { CropService } from '../../services/crop.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CropResponseDTO } from '../../dto/crop/CropResponseDTO';

const cropService = new CropService();

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const cropId = parseInt(id);

  if (isNaN(cropId)) {
    const customError = new CustomError(400, 'General', 'Invalid crop ID');
    return next(customError);
  }

  try {
    const withRelations = req.query.withRelations === 'true';

    const cropService = new CropService();
    const cropEntity = await cropService.findOne(cropId, withRelations);

    if (!cropEntity) {
      const customError = new CustomError(404, 'General', `Crop with id:${cropId} not found.`);
      return next(customError);
    }

    const cropResponseDTO = new CropResponseDTO(cropEntity, withRelations);

    res.customSuccess(200, 'Crop retrieved successfully', cropResponseDTO);
  } catch (err) {
    const customError = new CustomError(500, 'Raw', 'Error retrieving crop', null, err);
    return next(customError);
  }
};
