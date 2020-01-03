import { Router } from 'express';
import propertiesController from '../controllers/properties';

const router = Router();

router.get('/byCommune:communesIds', propertiesController);

export default router;
