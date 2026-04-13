import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { fileService } from './file.service';
import { sendSuccess } from '../../utils/response';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export const fileController = {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } });
      }
      const result = await fileService.upload(req.file, req.user?.id);
      sendSuccess(res, result, 201);
    } catch (e) {
      next(e);
    }
  },

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await fileService.delete(+req.params.id);
      sendSuccess(res, result);
    } catch (e) {
      next(e);
    }
  },

  async getPresignedUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await fileService.getPresignedUrl(req.query.filename as string);
      sendSuccess(res, result);
    } catch (e) {
      next(e);
    }
  },
};
