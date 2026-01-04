import { Router } from 'express';
import { destroy, edit, list, show, create } from '../../controllers/field';
import { validatorCreateField } from '../../middleware/validation/field/validatorCreateField';
import { validatorUpdateField } from '../../middleware/validation/field/validatorUpdateField';

const router = Router();

router.get('/', list);
router.get('/:field_name', show);
router.post('/', validatorCreateField, create); 
router.put('/:field_name', validatorUpdateField, edit); 
router.delete('/:field_name', destroy);

export default router;