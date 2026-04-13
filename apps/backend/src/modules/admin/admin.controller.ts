import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const adminController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const { data, total } = await adminService.findAll(p); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await adminService.create(req.body, req.user?.id), 201); } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await adminService.delete(+req.params.id, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try { await adminService.resetPassword(+req.params.id, req.body.password); sendSuccess(res, { message: 'Password reset' }); } catch (e) { next(e); }
  },
};
