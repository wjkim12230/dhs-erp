import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { loginSchema, refreshSchema } from './auth.validator';
import { sendSuccess } from '../../utils/response';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId, password } = loginSchema.parse(req.body);
      const result = await authService.login(loginId, password);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      const result = await authService.refresh(refreshToken);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  },
};
