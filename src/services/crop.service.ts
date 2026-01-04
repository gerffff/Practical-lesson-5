import { getRepository, Repository } from 'typeorm';
import { Crop } from '../orm/entities/crop/Crop';
import { Field } from '../orm/entities/fields/Field';
import { CreateCropDTO } from '../dto/crop/CreateCropDTO';
import { UpdateCropDTO } from '../dto/crop/UpdateCropDTO'; 


export class CropService {
  private getCropRepository(): Repository<Crop> {
    return getRepository(Crop);
  }

  private getFieldRepository(): Repository<Field> {
    return getRepository(Field);
  }

  async create(createCropDto: CreateCropDTO): Promise<Crop> { 
    const cropRepository = this.getCropRepository();
    const fieldRepository = this.getFieldRepository();

    const field = await fieldRepository.findOne({
      where: { field_name: createCropDto.field_name },
    });

    if (!field) {
      throw new Error(`Field with name '${createCropDto.field_name}' not found`);
    }

    const crop = cropRepository.create({
      ...createCropDto,
      field: field,
      crop_start_date: new Date(createCropDto.crop_start_date),
      crop_harvest_date: new Date(createCropDto.crop_harvest_date),
    });

    const savedCrop = await cropRepository.save(crop);
    return savedCrop; 
  }

  async findAll(withRelations: boolean = false): Promise<Crop[]> {
    const cropRepository = this.getCropRepository();
    
    const relations = ['field'];
    if (withRelations) {
      relations.push('fieldWorks');
    }
    
    const crops = await cropRepository.find({
      relations: relations,
    });
    
    return crops; 
  }

  async findOne(cropId: number, withRelations: boolean = true): Promise<Crop | null> { 
    const cropRepository = this.getCropRepository();
    
    const relations = ['field']; 
    if (withRelations) {
      relations.push('fieldWorks'); 
    }
    
    const crop = await cropRepository.findOne({
      where: { crop_id: cropId },
      relations: relations,
    });
  
    if (!crop) {
      return null;
    }
  
    return crop; 
  }

  async update(cropId: number, updateCropDto: UpdateCropDTO): Promise<Crop | null> { 
    const cropRepository = this.getCropRepository();
    const fieldRepository = this.getFieldRepository();
    
    const crop = await cropRepository.findOne({
      where: { crop_id: cropId },
      relations: ['field'],
    });
    
    if (!crop) {
      return null;
    }

    if (updateCropDto.field_name && updateCropDto.field_name !== crop.field.field_name) {
      const newField = await fieldRepository.findOne({
        where: { field_name: updateCropDto.field_name },
      });

      if (!newField) {
        throw new Error(`Field with name '${updateCropDto.field_name}' not found`);
      }
      crop.field = newField;
    }

    if (updateCropDto.cultivated_plant_name !== undefined) {
      crop.cultivated_plant_name = updateCropDto.cultivated_plant_name;
    }
    if (updateCropDto.crop_start_date !== undefined) {
      crop.crop_start_date = new Date(updateCropDto.crop_start_date);
    }
    if (updateCropDto.crop_harvest_date !== undefined) {
      crop.crop_harvest_date = new Date(updateCropDto.crop_harvest_date);
    }
    if (updateCropDto.actual_harvest_tons !== undefined) {
      crop.actual_harvest_tons = updateCropDto.actual_harvest_tons;
    }
    if (updateCropDto.crop_status !== undefined) {
      crop.crop_status = updateCropDto.crop_status;
    }

    const updatedCrop = await cropRepository.save(crop);
    return updatedCrop; 
  }

  async remove(cropId: number): Promise<boolean> {
    const cropRepository = this.getCropRepository();
    const result = await cropRepository.delete(cropId);
    return result.affected !== null && result.affected > 0;
  }
}