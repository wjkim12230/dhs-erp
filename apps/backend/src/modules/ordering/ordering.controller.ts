import { Request, Response, NextFunction } from 'express';
import { orderingService } from './ordering.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const orderingController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const p = parsePagination(req);
      const f = { status: req.query.status as string, customerName: req.query.customerName as string, orderNumber: req.query.orderNumber as string, modelId: req.query.modelId ? +req.query.modelId : undefined, orderDateFrom: req.query.orderDateFrom as string, orderDateTo: req.query.orderDateTo as string };
      const { data, total } = await orderingService.findAll(p, f);
      sendPaginated(res, data, { page: p.page, limit: p.limit, total });
    } catch (e) { next(e); }
  },
  async findById(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await orderingService.findById(+req.params.id)); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await orderingService.create(req.body, req.user?.id), 201); } catch (e) { next(e); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await orderingService.update(+req.params.id, req.body, req.user?.id)); } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await orderingService.softDelete(+req.params.id, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
  async complete(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await orderingService.complete(+req.params.id, req.user?.id)); } catch (e) { next(e); }
  },
  async recover(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await orderingService.recover(+req.params.id, req.user?.id)); } catch (e) { next(e); }
  },
  async copy(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await orderingService.copy(+req.params.id, req.user?.id), 201); } catch (e) { next(e); }
  },
};
