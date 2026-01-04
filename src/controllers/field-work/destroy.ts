import { Request, Response, NextFunction } from 'express';
import { FieldWorkService } from '../../services/field-work.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';

const fieldWorkService = new FieldWorkService();

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const workId = parseInt(id);

  if (isNaN(workId)) {
    const customError = new CustomError(400, 'General', 'Invalid field work ID');
    return next(customError);
  }

  try {
    const result = await fieldWorkService.remove(workId);

    if (!result) {
      const customError = new CustomError(404, 'General', `Field work with id:${workId} not found.`);
      return next(customError);
    }

    res.customSuccess(200, `Field work with id:${workId} deleted successfully.`);
  } catch (err) {
    const customError = new CustomError(500, 'Raw', 'Error deleting field work', null, err);
    return next(customError);
  }
};
