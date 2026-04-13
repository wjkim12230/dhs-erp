import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { PaginationOptions } from '../../utils/pagination';

export const modelService = {
  // === Model Groups ===
  async findAllGroups(pagination: PaginationOptions) {
    const where: Prisma.ModelGroupWhereInput = { isDeleted: false };
    const [data, total] = await Promise.all([
      prisma.modelGroup.findMany({ where, include: { models: { where: { isDeleted: false }, select: { id: true, name: true } } }, orderBy: { [pagination.sort]: pagination.order }, skip: pagination.skip, take: pagination.limit }),
      prisma.modelGroup.count({ where }),
    ]);
    return { data, total };
  },
  async createGroup(data: { name: string; priority?: number }, userId?: number) {
    return prisma.modelGroup.create({ data: { ...data, priority: data.priority ?? 0, createdBy: userId, updatedBy: userId } });
  },
  async updateGroup(id: number, data: { name?: string; priority?: number; version: number }, userId?: number) {
    const existing = await prisma.modelGroup.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) throw new AppError(404, 'NOT_FOUND', 'ModelGroup not found');
    if (existing.version !== data.version) throw new AppError(409, 'CONFLICT', 'Modified by another user');
    const { version, ...rest } = data;
    return prisma.modelGroup.update({ where: { id }, data: { ...rest, updatedBy: userId, version: { increment: 1 } } });
  },
  async deleteGroup(id: number, userId?: number) {
    return prisma.modelGroup.update({ where: { id }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },

  // === Models ===
  async findAll(pagination: PaginationOptions, filters: { modelGroupId?: number }) {
    const where: Prisma.ModelWhereInput = { isDeleted: false };
    if (filters.modelGroupId) where.modelGroupId = filters.modelGroupId;
    const [data, total] = await Promise.all([
      prisma.model.findMany({ where, include: { modelGroup: { select: { id: true, name: true } } }, orderBy: { [pagination.sort]: pagination.order }, skip: pagination.skip, take: pagination.limit }),
      prisma.model.count({ where }),
    ]);
    return { data, total };
  },
  async findById(id: number) {
    const model = await prisma.model.findUnique({
      where: { id },
      include: {
        modelGroup: true,
        modelDetails: { where: { isDeleted: false }, orderBy: { priority: 'asc' } },
        specifications: { where: { isDeleted: false }, orderBy: { priority: 'asc' }, include: { specificationDetails: { where: { isDeleted: false }, orderBy: { priority: 'asc' } } } },
        drawings: { where: { isDeleted: false } },
        checkItems: { where: { isDeleted: false }, orderBy: { priority: 'asc' }, include: { checkItemDetails: { where: { isDeleted: false }, orderBy: { priority: 'asc' } } } },
      },
    });
    if (!model || model.isDeleted) throw new AppError(404, 'NOT_FOUND', 'Model not found');
    return model;
  },
  async create(data: { name: string; orderingName?: string; priority?: number; departments?: string[]; modelGroupId: number }, userId?: number) {
    return prisma.model.create({ data: { ...data, departments: (data.departments ?? []) as any, priority: data.priority ?? 0, createdBy: userId, updatedBy: userId } });
  },
  async update(id: number, data: any, userId?: number) {
    const existing = await prisma.model.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) throw new AppError(404, 'NOT_FOUND', 'Model not found');
    if (existing.version !== data.version) throw new AppError(409, 'CONFLICT', 'Modified by another user');
    const { version, ...rest } = data;
    if (rest.departments) rest.departments = rest.departments as any;
    return prisma.model.update({ where: { id }, data: { ...rest, updatedBy: userId, version: { increment: 1 } } });
  },
  async deleteModel(id: number, userId?: number) {
    return prisma.model.update({ where: { id }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },

  // === Model Details ===
  async findDetails(modelId: number, pagination: PaginationOptions) {
    const where: Prisma.ModelDetailWhereInput = { modelId, isDeleted: false };
    const [data, total] = await Promise.all([
      prisma.modelDetail.findMany({ where, orderBy: { priority: 'asc' }, skip: pagination.skip, take: pagination.limit }),
      prisma.modelDetail.count({ where }),
    ]);
    return { data, total };
  },
  async createDetail(modelId: number, data: { name: string; priority?: number }, userId?: number) {
    return prisma.modelDetail.create({ data: { ...data, priority: data.priority ?? 0, modelId, createdBy: userId, updatedBy: userId } });
  },
  async updateDetail(detailId: number, data: any, userId?: number) {
    const { version, ...rest } = data;
    return prisma.modelDetail.update({ where: { id: detailId }, data: { ...rest, updatedBy: userId, version: { increment: 1 } } });
  },
  async deleteDetail(detailId: number, userId?: number) {
    return prisma.modelDetail.update({ where: { id: detailId }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },
};
