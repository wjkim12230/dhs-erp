import { Request, Response, NextFunction } from 'express';
import { modelService } from './model.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const modelController = {
  // Groups
  async findAllGroups(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const { data, total } = await modelService.findAllGroups(p); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try { const g = await modelService.createGroup(req.body, req.user?.id); sendSuccess(res, g, 201); } catch (e) { next(e); }
  },
  async updateGroup(req: Request, res: Response, next: NextFunction) {
    try { const g = await modelService.updateGroup(+req.params.id, req.body, req.user?.id); sendSuccess(res, g); } catch (e) { next(e); }
  },
  async deleteGroup(req: Request, res: Response, next: NextFunction) {
    try { await modelService.deleteGroup(+req.params.id, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },

  // Models
  async findAll(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const f = { modelGroupId: req.query.modelGroupId ? +req.query.modelGroupId : undefined }; const { data, total } = await modelService.findAll(p, f); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async findById(req: Request, res: Response, next: NextFunction) {
    try { const m = await modelService.findById(+req.params.id); sendSuccess(res, m); } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { const m = await modelService.create(req.body, req.user?.id); sendSuccess(res, m, 201); } catch (e) { next(e); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { const m = await modelService.update(+req.params.id, req.body, req.user?.id); sendSuccess(res, m); } catch (e) { next(e); }
  },
  async deleteModel(req: Request, res: Response, next: NextFunction) {
    try { await modelService.deleteModel(+req.params.id, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },

  // Model Details
  async findDetails(req: Request, res: Response, next: NextFunction) {
    try { const p = parsePagination(req); const { data, total } = await modelService.findDetails(+req.params.modelId, p); sendPaginated(res, data, { page: p.page, limit: p.limit, total }); } catch (e) { next(e); }
  },
  async createDetail(req: Request, res: Response, next: NextFunction) {
    try { const d = await modelService.createDetail(+req.params.modelId, req.body, req.user?.id); sendSuccess(res, d, 201); } catch (e) { next(e); }
  },
  async updateDetail(req: Request, res: Response, next: NextFunction) {
    try { const d = await modelService.updateDetail(+req.params.detailId, req.body, req.user?.id); sendSuccess(res, d); } catch (e) { next(e); }
  },
  async deleteDetail(req: Request, res: Response, next: NextFunction) {
    try { await modelService.deleteDetail(+req.params.detailId, req.user?.id); sendSuccess(res, { message: 'Deleted' }); } catch (e) { next(e); }
  },
};
