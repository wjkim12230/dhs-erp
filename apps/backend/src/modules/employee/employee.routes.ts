import { Router } from 'express';
import { employeeController } from './employee.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', employeeController.findAll);
router.get('/check-number', employeeController.checkNumber);
router.get('/:id', employeeController.findById);
router.post('/', authorize('SUPER', 'ADMIN'), employeeController.create);
router.patch('/:id', authorize('SUPER', 'ADMIN'), employeeController.update);
router.delete('/:id', authorize('SUPER', 'ADMIN'), employeeController.delete);
router.post('/:id/recover', authorize('SUPER', 'ADMIN'), employeeController.recover);

export default router;
