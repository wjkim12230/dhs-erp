import { Router } from 'express';
import { settingsController } from './settings.controller';
import { authenticate, authorize } from '../../middleware/auth';
const router = Router();
router.use(authenticate);
router.get('/', settingsController.get);
router.patch('/', authorize('SUPER', 'ADMIN'), settingsController.update);
export default router;
