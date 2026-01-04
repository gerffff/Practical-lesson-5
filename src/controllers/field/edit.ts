import { Request, Response, NextFunction } from 'express';
import { FieldService } from '../../services/field.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { UpdateFieldDTO } from '../../dto/field/UpdateFieldDTO';
import { FieldResponseDTO } from '../../dto/field/FieldResponseDTO';

const fieldService = new FieldService();

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { field_name } = req.params;

    const updateFieldDto: UpdateFieldDTO = {};

    if (req.body.area_hectares !== undefined) {
      updateFieldDto.area_hectares = parseFloat(req.body.area_hectares);
    }
    if (req.body.soil_type !== undefined) {
      updateFieldDto.soil_type = req.body.soil_type;
    }
    if (req.body.field_location !== undefined) {
      updateFieldDto.field_location = req.body.field_location;
    }

    if (Object.keys(updateFieldDto).length === 0) {
      const customError = new CustomError(400, 'General', 'No fields to update');
      return next(customError);
    }

    const updatedFieldEntity = await fieldService.update(field_name, updateFieldDto);

    if (!updatedFieldEntity) {
      const customError = new CustomError(404, 'General', `Field with name '${field_name}' not found.`);
      return next(customError);
    }

    const fieldResponseDTO = new FieldResponseDTO(updatedFieldEntity, true);

    res.customSuccess(200, 'Field updated successfully', fieldResponseDTO);
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }
    const customError = new CustomError(500, 'Raw', 'Error updating field', null, error);
    return next(customError);
  }
};
