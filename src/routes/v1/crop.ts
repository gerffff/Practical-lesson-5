import { Router } from 'express';
import { destroy, edit, list, show, create } from '../../controllers/crop';
import { validatorCreateCrop } from '../../middleware/validation/crop/validatorCreateCrop';
import { validatorUpdateCrop } from '../../middleware/validation/crop/validatorUpdateCrop';

const router = Router();

router.get('/', list);
router.get('/:id', show);
router.post('/', validatorCreateCrop, create); 
router.put('/:id', validatorUpdateCrop, edit); 
router.delete('/:id', destroy);

export default router;