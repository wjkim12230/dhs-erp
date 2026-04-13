import { Request, Response, NextFunction } from 'express';
import { checkItemService } from './check-item.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const checkItemController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const { data, total } = await checkItemService.findAll(p); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await checkItemService.create(req.body, req.user?.id), 201); } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await checkItemService.delete(+req.params.id, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
  async findDetails(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const { data, total } = await checkItemService.findDetails(+req.params.checkItemId, p); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async createDetail(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await checkItemService.createDetail(+req.params.checkItemId, req.body, req.user?.id), 201); } catch (e) { next(e); }
  },
  async deleteDetail(req: Request, res: Response, next: NextFunction) {
    try { await checkItemService.deleteDetail(+req.params.detailId, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
};
