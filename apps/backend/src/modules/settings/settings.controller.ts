import { Request, Response, NextFunction } from 'express';
import { settingsService } from './settings.service';
import { sendSuccess } from '../../utils/response';

export const settingsController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await settingsService.get()); } catch (e) { next(e); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await settingsService.update(req.body)); } catch (e) { next(e); }
  },
};
