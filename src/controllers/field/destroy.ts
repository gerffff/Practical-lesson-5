import { Request, Response, NextFunction } from 'express';
import { FieldService } from '../../services/field.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';

const fieldService = new FieldService();

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { field_name } = req.params;

    const result = await fieldService.remove(field_name);

    if (!result) {
      const customError = new CustomError(404, 'General', `Field with name '${field_name}' not found.`);
      return next(customError);
    }

    res.customSuccess(200, `Field '${field_name}' deleted successfully`);
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }

    if (error.code === '23503') {
      const customError = new CustomError(
        409,
        'General',
        `Cannot delete field '${req.params.field_name}' because it has related crops. Delete crops first.`,
      );
      return next(customError);
    }

    const customError = new CustomError(500, 'Raw', 'Error deleting field', null, error);
    return next(customError);
  }
};
