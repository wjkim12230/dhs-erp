import { Router } from 'express';
import { fileController, upload } from './file.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.delete('/:id', fileController.deleteFile);

export default router;
