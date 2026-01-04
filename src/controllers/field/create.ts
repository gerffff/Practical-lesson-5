import { Request, Response, NextFunction } from 'express';
import { FieldService } from '../../services/field.service';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { CreateFieldDTO } from '../../dto/field/CreateFieldDTO';
import { FieldResponseDTO } from '../../dto/field/FieldResponseDTO';

const fieldService = new FieldService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { field_name, area_hectares, soil_type, field_location } = req.body;

  console.log('Полученные данные:', req.body); // ДЛЯ ДЕБАГА

  // Проверяем, что поля существуют и не пустые строки
  if (!field_name || !area_hectares || !soil_type || !field_location) {
    console.log('Пропущенные поля:', {
      field_name: !field_name,
      area_hectares: !area_hectares,
      soil_type: !soil_type,
      field_location: !field_location,
    });
    const customError = new CustomError(400, 'General', 'All fields are required');
    return next(customError);
  }

  // Проверяем, что строки не состоят только из пробелов
  if (
    (typeof field_name === 'string' && field_name.trim() === '') ||
    (typeof soil_type === 'string' && soil_type.trim() === '') ||
    (typeof field_location === 'string' && field_location.trim() === '')
  ) {
    const customError = new CustomError(400, 'General', 'Fields cannot be empty strings');
    return next(customError);
  }

  const createFieldDto: CreateFieldDTO = {
    field_name: field_name.toString().trim(),
    area_hectares: parseFloat(area_hectares),
    soil_type: soil_type.toString().trim(),
    field_location: field_location.toString().trim(),
  };

  try {
    // Сервис возвращает entity
    const fieldEntity = await fieldService.create(createFieldDto);

    // КОНТРОЛЛЕР создает DTO из entity
    const fieldResponseDTO = new FieldResponseDTO(fieldEntity, false);

    res.customSuccess(201, 'Field created successfully', fieldResponseDTO);
  } catch (err) {
    console.error('Ошибка при создании поля:', err);

    if (err.code === '23505') {
      const customError = new CustomError(409, 'General', `Field with name '${field_name}' already exists.`);
      return next(customError);
    }

    if (err.message.includes('already exists')) {
      const customError = new CustomError(409, 'General', err.message);
      return next(customError);
    }

    const customError = new CustomError(500, 'Raw', 'Error creating field', null, err);
    return next(customError);
  }
};
