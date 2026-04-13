import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { PaginationOptions } from '../../utils/pagination';

export const checkItemService = {
  async findAll(pagination: PaginationOptions) {
    const where = { isDeleted: false };
    const [data, total] = await Promise.all([
      prisma.checkItem.findMany({ where, include: { model: { select: { id: true, name: true } } }, orderBy: { [pagination.sort]: pagination.order }, skip: pagination.skip, take: pagination.limit }),
      prisma.checkItem.count({ where }),
    ]);
    return { data, total };
  },
  async create(data: { name: string; priority?: number; modelId: number }, userId?: number) {
    return prisma.checkItem.create({ data: { ...data, priority: data.priority ?? 0, createdBy: userId, updatedBy: userId } });
  },
  async delete(id: number, userId?: number) {
    return prisma.checkItem.update({ where: { id }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },
  async findDetails(ciId: number, pagination: PaginationOptions) {
    const where = { checkItemId: ciId, isDeleted: false };
    const [data, total] = await Promise.all([
      prisma.checkItemDetail.findMany({ where, orderBy: { priority: 'asc' }, skip: pagination.skip, take: pagination.limit }),
      prisma.checkItemDetail.count({ where }),
    ]);
    return { data, total };
  },
  async createDetail(ciId: number, data: { name: string; priority?: number }, userId?: number) {
    return prisma.checkItemDetail.create({ data: { ...data, priority: data.priority ?? 0, checkItemId: ciId, createdBy: userId, updatedBy: userId } });
  },
  async deleteDetail(detailId: number, userId?: number) {
    return prisma.checkItemDetail.update({ where: { id: detailId }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },
};
