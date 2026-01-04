import { Request, Response, NextFunction } from 'express';
import { CropService } from '../../services/crop.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { UpdateCropDTO } from '../../dto/crop/UpdateCropDTO';
import { CropResponseDTO } from '../../dto/crop/CropResponseDTO';

const cropService = new CropService();

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const cropId = parseInt(id);
  const { field_name, cultivated_plant_name, crop_start_date, crop_harvest_date, actual_harvest_tons, crop_status } =
    req.body;

  if (isNaN(cropId)) {
    const customError = new CustomError(400, 'General', 'Invalid crop ID');
    return next(customError);
  }

  try {
    const cropEntity = await cropService.findOne(cropId, false);

    if (!cropEntity) {
      const customError = new CustomError(404, 'General', `Crop with id:${cropId} not found.`, ['Crop not found.']);
      return next(customError);
    }

    const updateData: UpdateCropDTO = {};
    if (field_name !== undefined) updateData.field_name = field_name;
    if (cultivated_plant_name !== undefined) updateData.cultivated_plant_name = cultivated_plant_name;
    if (crop_start_date !== undefined) updateData.crop_start_date = crop_start_date;
    if (crop_harvest_date !== undefined) updateData.crop_harvest_date = crop_harvest_date;
    if (actual_harvest_tons !== undefined) updateData.actual_harvest_tons = parseFloat(actual_harvest_tons);
    if (crop_status !== undefined) updateData.crop_status = crop_status;

    if (Object.keys(updateData).length === 0) {
      const customError = new CustomError(400, 'General', 'No fields to update');
      return next(customError);
    }

    const updatedCropEntity = await cropService.update(cropId, updateData);

    if (!updatedCropEntity) {
      const customError = new CustomError(404, 'General', `Crop with id:${cropId} not found.`);
      return next(customError);
    }

    const cropResponseDTO = new CropResponseDTO(updatedCropEntity, true);

    res.customSuccess(200, 'Crop updated successfully', cropResponseDTO);
  } catch (err) {
    if (err.message.includes('not found')) {
      const customError = new CustomError(404, 'General', err.message);
      return next(customError);
    }

    const customError = new CustomError(500, 'Raw', 'Error updating crop', null, err);
    return next(customError);
  }
};
