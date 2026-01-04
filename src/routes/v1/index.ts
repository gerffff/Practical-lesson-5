import { Router } from 'express';
import auth from './auth';
import users from './users';
import field from './field';
import crop from './crop';
import fieldWork from './field-work'; 

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/fields', field);
router.use('/crops', crop);
router.use('/field-works', fieldWork); 

export default router;