import { getRepository, Repository } from 'typeorm';
import { Field } from '../orm/entities/fields/Field';
import { CreateFieldDTO } from '../dto/field/CreateFieldDTO';
import { UpdateFieldDTO } from '../dto/field/UpdateFieldDTO';

export class FieldService {
  private getFieldRepository(): Repository<Field> {
    return getRepository(Field);
  }

  async create(createFieldDto: CreateFieldDTO): Promise<Field> {
    const fieldRepository = this.getFieldRepository();
    
    const existingField = await fieldRepository.findOne({
      where: { field_name: createFieldDto.field_name },
    });

    if (existingField) {
      throw new Error(`Field with name '${createFieldDto.field_name}' already exists`);
    }

    const field = fieldRepository.create(createFieldDto);
    const savedField = await fieldRepository.save(field);
    
    return savedField; 
  }

  async findAll(withCrops: boolean = false): Promise<Field[]> {
    const fieldRepository = this.getFieldRepository(); 
    
    const fields = await fieldRepository.find({
      relations: withCrops ? ['crops'] : [],
    });

    return fields;
  }

  async findOne(fieldName: string, withCrops: boolean = true): Promise<Field | null> {
    const fieldRepository = this.getFieldRepository();
    
    const field = await fieldRepository.findOne({
      where: { field_name: fieldName },
      relations: withCrops ? ['crops'] : [],
    });

    if (!field) {
      return null;
    }

    return field; 
  }

  async update(fieldName: string, updateFieldDto: UpdateFieldDTO): Promise<Field | null> {
    const fieldRepository = this.getFieldRepository(); 
    
    const field = await fieldRepository.findOne({ 
      where: { field_name: fieldName },
      relations: ['crops']
    });
    
    if (!field) {
      return null;
    }

    if (updateFieldDto.area_hectares !== undefined) {
      field.area_hectares = updateFieldDto.area_hectares;
    }
    if (updateFieldDto.soil_type !== undefined) {
      field.soil_type = updateFieldDto.soil_type;
    }
    if (updateFieldDto.field_location !== undefined) {
      field.field_location = updateFieldDto.field_location;
    }
    
    const updatedField = await fieldRepository.save(field);
    return updatedField; 
  }

  async remove(fieldName: string): Promise<boolean> {
    const fieldRepository = this.getFieldRepository(); 
    
    const result = await fieldRepository.delete(fieldName);
    return result.affected !== null && result.affected > 0;
  }
}