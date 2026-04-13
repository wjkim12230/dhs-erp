import { Request, Response, NextFunction } from 'express';
import { drawingService } from './drawing.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const drawingController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const { data, total } = await drawingService.findAll(p); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async findById(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await drawingService.findById(+req.params.id)); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await drawingService.create(req.body, req.user?.id), 201); } catch (e) { next(e); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await drawingService.update(+req.params.id, req.body, req.user?.id)); } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await drawingService.delete(+req.params.id, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
};
