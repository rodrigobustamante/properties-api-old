import { Router } from 'express';
import propertiesController from '../controllers/properties';

const router = Router();

router.post('/byCommuneId', propertiesController);

export default router;
