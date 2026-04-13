import { Request } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sort: string;
  order: 'asc' | 'desc';
}

export function parsePagination(req: Request): PaginationOptions {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const sort = (req.query.sort as string) || 'createdAt';
  const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort,
    order,
  };
}
