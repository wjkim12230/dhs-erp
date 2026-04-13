import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { PaginationOptions } from '../../utils/pagination';

export const drawingService = {
  async findAll(pagination: PaginationOptions) {
    const where = { isDeleted: false };
    const [data, total] = await Promise.all([
      prisma.drawing.findMany({ where, include: { model: { select: { id: true, name: true } } }, orderBy: { [pagination.sort]: pagination.order }, skip: pagination.skip, take: pagination.limit }),
      prisma.drawing.count({ where }),
    ]);
    return { data, total };
  },
  async findById(id: number) {
    const d = await prisma.drawing.findUnique({ where: { id }, include: { drawingToSpecifications: { include: { specification: true } } } });
    if (!d || d.isDeleted) throw new AppError(404, 'NOT_FOUND', 'Drawing not found');
    return d;
  },
  async create(data: { imageUrl: string; lengthCount?: number; modelId: number }, userId?: number) {
    return prisma.drawing.create({ data: { ...data, createdBy: userId, updatedBy: userId } });
  },
  async update(id: number, data: any, userId?: number) {
    const existing = await prisma.drawing.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) throw new AppError(404, 'NOT_FOUND', 'Drawing not found');
    if (existing.version !== data.version) throw new AppError(409, 'CONFLICT', 'Modified by another user');
    const { version, ...rest } = data;
    return prisma.drawing.update({ where: { id }, data: { ...rest, updatedBy: userId, version: { increment: 1 } } });
  },
  async delete(id: number, userId?: number) {
    return prisma.drawing.update({ where: { id }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },
};
