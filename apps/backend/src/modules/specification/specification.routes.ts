import { Router } from 'express';
import { specificationController } from './specification.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);
router.get('/', specificationController.findAll);
router.post('/', specificationController.create);
router.patch('/:id', specificationController.update);
router.delete('/:id', specificationController.delete);
router.get('/:specId/details', specificationController.findDetails);
router.post('/:specId/details', specificationController.createDetail);
router.delete('/:specId/details/:detailId', specificationController.deleteDetail);

export default router;
