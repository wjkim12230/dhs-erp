import { Request, Response, NextFunction } from 'express';
import { specificationService } from './specification.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const specificationController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const f = { modelId: req.query.modelId ? +req.query.modelId : undefined }; const { data, total } = await specificationService.findAll(p, f); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { const s = await specificationService.create(req.body, req.user?.id); sendSuccess(res, s, 201); } catch (e) { next(e); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { const s = await specificationService.update(+req.params.id, req.body, req.user?.id); sendSuccess(res, s); } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await specificationService.delete(+req.params.id, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
  async findDetails(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const { data, total } = await specificationService.findDetails(+req.params.specId, p); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async createDetail(req: Request, res: Response, next: NextFunction) {
    try { const d = await specificationService.createDetail(+req.params.specId, req.body, req.user?.id); sendSuccess(res, d, 201); } catch (e) { next(e); }
  },
  async deleteDetail(req: Request, res: Response, next: NextFunction) {
    try { await specificationService.deleteDetail(+req.params.detailId, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
};
