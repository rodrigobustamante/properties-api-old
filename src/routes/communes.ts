import { Router } from 'express';
import communeController from '../controllers/communes';

const router = Router();

router.get('/', communeController);

export default router;
