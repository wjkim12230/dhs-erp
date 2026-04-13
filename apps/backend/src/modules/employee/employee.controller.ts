import { Request, Response, NextFunction } from 'express';
import { employeeService } from './employee.service';
import { employeeCreateSchema, employeeUpdateSchema } from './employee.validator';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const employeeController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req);
      const filters = {
        name: req.query.name as string,
        department: req.query.department as string,
        employmentStatus: req.query.employmentStatus as string,
        headquarter: req.query.headquarter as string,
      };
      const { data, total } = await employeeService.findAll(pagination, filters);
      sendPaginated(res, data, { page: pagination.page, limit: pagination.limit, total });
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.findById(parseInt(req.params.id));
      sendSuccess(res, employee);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = employeeCreateSchema.parse(req.body);
      const employee = await employeeService.create(data, req.user?.id);
      sendSuccess(res, employee, 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = employeeUpdateSchema.parse(req.body);
      const employee = await employeeService.update(parseInt(req.params.id), data, req.user?.id);
      sendSuccess(res, employee);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await employeeService.softDelete(parseInt(req.params.id), req.user?.id);
      sendSuccess(res, { message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async recover(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.recover(parseInt(req.params.id), req.user?.id);
      sendSuccess(res, employee);
    } catch (err) {
      next(err);
    }
  },

  async checkNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeService.checkEmployeeNumber(req.query.employeeNumber as string);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },
};
