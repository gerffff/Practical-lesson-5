import { getRepository, Repository } from 'typeorm';
import { FieldWork } from '../orm/entities/field-work/FieldWork';
import { Crop } from '../orm/entities/crop/Crop';
import { CreateFieldWorkDTO } from '../dto/field-work/CreateFieldWorkDTO';
import { UpdateFieldWorkDTO } from '../dto/field-work/UpdateFieldWorkDTO';

export class FieldWorkService {
  private getFieldWorkRepository(): Repository<FieldWork> {
    return getRepository(FieldWork);
  }

  private getCropRepository(): Repository<Crop> {
    return getRepository(Crop);
  }

  async create(createFieldWorkDto: CreateFieldWorkDTO): Promise<FieldWork> { 
    const fieldWorkRepository = this.getFieldWorkRepository();
    const cropRepository = this.getCropRepository();

    const crop = await cropRepository.findOne({
      where: { crop_id: createFieldWorkDto.crop_id },
    });

    if (!crop) {
      throw new Error(`Crop with ID '${createFieldWorkDto.crop_id}' not found`);
    }

    const fieldWork = fieldWorkRepository.create({
      ...createFieldWorkDto,
      crop: crop,
      work_start_date: new Date(createFieldWorkDto.work_start_date),
      work_end_date: new Date(createFieldWorkDto.work_end_date),
    });

    const savedFieldWork = await fieldWorkRepository.save(fieldWork);
    return savedFieldWork; 
  }

  async findAll(withRelations: boolean = false): Promise<FieldWork[]> { 
    const fieldWorkRepository = this.getFieldWorkRepository();
    
    const relations = ['crop']; 
    if (withRelations) {
      relations.push('crop.field'); 
    }
    
    const fieldWorks = await fieldWorkRepository.find({
      relations: relations,
    });
    
    return fieldWorks; 
  }

  async findOne(workId: number, withRelations: boolean = true): Promise<FieldWork | null> { 
    const fieldWorkRepository = this.getFieldWorkRepository();
    
    const relations = ['crop']; 
    if (withRelations) {
      relations.push('crop.field'); 
    }
    
    const fieldWork = await fieldWorkRepository.findOne({
      where: { work_id: workId },
      relations: relations,
    });
  
    if (!fieldWork) {
      return null;
    }
  
    return fieldWork; 
  }

  async update(workId: number, updateFieldWorkDto: UpdateFieldWorkDTO): Promise<FieldWork | null> { // Возвращаем FieldWork | null
    const fieldWorkRepository = this.getFieldWorkRepository();
    const cropRepository = this.getCropRepository();
    
    const fieldWork = await fieldWorkRepository.findOne({
      where: { work_id: workId },
      relations: ['crop'],
    });
    
    if (!fieldWork) {
      return null;
    }

    if (updateFieldWorkDto.crop_id && updateFieldWorkDto.crop_id !== fieldWork.crop.crop_id) {
      const newCrop = await cropRepository.findOne({
        where: { crop_id: updateFieldWorkDto.crop_id },
      });

      if (!newCrop) {
        throw new Error(`Crop with ID '${updateFieldWorkDto.crop_id}' not found`);
      }
      fieldWork.crop = newCrop;
    }

    if (updateFieldWorkDto.employee_id !== undefined) {
      fieldWork.employee_id = updateFieldWorkDto.employee_id;
    }
    if (updateFieldWorkDto.machinery_id !== undefined) {
      fieldWork.machinery_id = updateFieldWorkDto.machinery_id;
    }
    if (updateFieldWorkDto.work_type !== undefined) {
      fieldWork.work_type = updateFieldWorkDto.work_type;
    }
    if (updateFieldWorkDto.work_start_date !== undefined) {
      fieldWork.work_start_date = new Date(updateFieldWorkDto.work_start_date);
    }
    if (updateFieldWorkDto.work_end_date !== undefined) {
      fieldWork.work_end_date = new Date(updateFieldWorkDto.work_end_date);
    }

    const updatedFieldWork = await fieldWorkRepository.save(fieldWork);
    return updatedFieldWork; 
  }

  async remove(workId: number): Promise<boolean> {
    const fieldWorkRepository = this.getFieldWorkRepository();
    const result = await fieldWorkRepository.delete(workId);
    return result.affected !== null && result.affected > 0;
  }
}