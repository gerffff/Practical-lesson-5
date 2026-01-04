import { Request, Response, NextFunction } from 'express';
import { CropService } from '../../services/crop.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CreateCropDTO } from '../../dto/crop/CreateCropDTO';
import { CropResponseDTO } from '../../dto/crop/CropResponseDTO';

const cropService = new CropService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body || {};
  const { field_name, cultivated_plant_name, crop_start_date, crop_harvest_date, actual_harvest_tons, crop_status } =
    body;

  if (
    !field_name ||
    !cultivated_plant_name ||
    !crop_start_date ||
    !crop_harvest_date ||
    !actual_harvest_tons ||
    !crop_status
  ) {
    const customError = new CustomError(400, 'General', 'All fields are required');
    return next(customError);
  }

  try {
    const createCropDto: CreateCropDTO = {
      field_name: field_name.toString().trim(),
      cultivated_plant_name: cultivated_plant_name.toString().trim(),
      crop_start_date: crop_start_date.toString().trim(),
      crop_harvest_date: crop_harvest_date.toString().trim(),
      actual_harvest_tons: parseFloat(actual_harvest_tons),
      crop_status: crop_status as any,
    };

    const cropEntity = await cropService.create(createCropDto);

    const cropResponseDTO = new CropResponseDTO(cropEntity, false);

    res.customSuccess(201, 'Crop created successfully', cropResponseDTO);
  } catch (err) {
    console.error('Ошибка при создании crop:', err);

    if (err.message.includes('not found')) {
      const customError = new CustomError(404, 'General', err.message);
      return next(customError);
    }

    const customError = new CustomError(500, 'Raw', 'Error creating crop', null, err);
    return next(customError);
  }
};
