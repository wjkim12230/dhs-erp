import { Router } from 'express';
import { modelController } from './model.controller';
import { authenticate } from '../../middleware/auth';

export const modelGroupRoutes = Router();
modelGroupRoutes.use(authenticate);
modelGroupRoutes.get('/', modelController.findAllGroups);
modelGroupRoutes.post('/', modelController.createGroup);
modelGroupRoutes.patch('/:id', modelController.updateGroup);
modelGroupRoutes.delete('/:id', modelController.deleteGroup);

export const modelRoutes = Router();
modelRoutes.use(authenticate);
modelRoutes.get('/', modelController.findAll);
modelRoutes.get('/:id', modelController.findById);
modelRoutes.post('/', modelController.create);
modelRoutes.patch('/:id', modelController.update);
modelRoutes.delete('/:id', modelController.deleteModel);
modelRoutes.get('/:modelId/details', modelController.findDetails);
modelRoutes.post('/:modelId/details', modelController.createDetail);
modelRoutes.patch('/:modelId/details/:detailId', modelController.updateDetail);
modelRoutes.delete('/:modelId/details/:detailId', modelController.deleteDetail);
