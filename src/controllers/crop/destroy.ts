import { Request, Response, NextFunction } from 'express';
import { CropService } from '../../services/crop.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';

const cropService = new CropService();

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const cropId = parseInt(id);

  if (isNaN(cropId)) {
    const customError = new CustomError(400, 'General', 'Invalid crop ID');
    return next(customError);
  }

  try {
    const result = await cropService.remove(cropId);

    if (!result) {
      const customError = new CustomError(404, 'General', `Crop with id:${cropId} not found.`, ['Crop not found.']);
      return next(customError);
    }

    res.customSuccess(200, `Crop with id:${cropId} deleted successfully.`);
  } catch (err) {
    if (err.code === '23503') {
      const customError = new CustomError(
        409,
        'General',
        `Cannot delete crop with id:${cropId} because it has related field works. Delete field works first.`,
      );
      return next(customError);
    }

    const customError = new CustomError(500, 'Raw', 'Error deleting crop', null, err);
    return next(customError);
  }
};
