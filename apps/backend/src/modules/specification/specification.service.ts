import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { PaginationOptions } from '../../utils/pagination';

export const specificationService = {
  async findAll(pagination: PaginationOptions, filters: { modelId?: number }) {
    const where: Prisma.SpecificationWhereInput = { isDeleted: false };
    if (filters.modelId) where.modelId = filters.modelId;
    const [data, total] = await Promise.all([
      prisma.specification.findMany({ where, orderBy: { [pagination.sort]: pagination.order }, skip: pagination.skip, take: pagination.limit }),
      prisma.specification.count({ where }),
    ]);
    return { data, total };
  },
  async create(data: { name: string; priority?: number; modelId: number }, userId?: number) {
    return prisma.specification.create({ data: { ...data, priority: data.priority ?? 0, createdBy: userId, updatedBy: userId } });
  },
  async update(id: number, data: any, userId?: number) {
    const existing = await prisma.specification.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) throw new AppError(404, 'NOT_FOUND', 'Specification not found');
    if (existing.version !== data.version) throw new AppError(409, 'CONFLICT', 'Modified by another user');
    const { version, ...rest } = data;
    return prisma.specification.update({ where: { id }, data: { ...rest, updatedBy: userId, version: { increment: 1 } } });
  },
  async delete(id: number, userId?: number) {
    return prisma.specification.update({ where: { id }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },
  async findDetails(specId: number, pagination: PaginationOptions) {
    const where: Prisma.SpecificationDetailWhereInput = { specificationId: specId, isDeleted: false };
    const [data, total] = await Promise.all([
      prisma.specificationDetail.findMany({ where, orderBy: { priority: 'asc' }, skip: pagination.skip, take: pagination.limit }),
      prisma.specificationDetail.count({ where }),
    ]);
    return { data, total };
  },
  async createDetail(specId: number, data: { name: string; orderingValue?: string; priority?: number }, userId?: number) {
    return prisma.specificationDetail.create({ data: { ...data, priority: data.priority ?? 0, specificationId: specId, createdBy: userId, updatedBy: userId } });
  },
  async deleteDetail(detailId: number, userId?: number) {
    return prisma.specificationDetail.update({ where: { id: detailId }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },
};
