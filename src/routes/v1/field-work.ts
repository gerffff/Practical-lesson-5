import { Router } from 'express';
import { destroy, edit, list, show, create } from '../../controllers/field-work';
import { validatorCreateFieldWork } from '../../middleware/validation/field-work/validatorCreateFieldWork';
import { validatorUpdateFieldWork } from '../../middleware/validation/field-work/validatorUpdateFieldWork';

const router = Router();

router.get('/', list);
router.get('/:id', show);
router.post('/', validatorCreateFieldWork, create); 
router.put('/:id', validatorUpdateFieldWork, edit); 
router.delete('/:id', destroy);

export default router;