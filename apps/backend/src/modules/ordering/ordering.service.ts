import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { PaginationOptions } from '../../utils/pagination';

export const orderingService = {
  async findAll(pagination: PaginationOptions, filters: { status?: string; customerName?: string; orderNumber?: string; modelId?: number; orderDateFrom?: string; orderDateTo?: string }) {
    const where: Prisma.OrderingWhereInput = { isDeleted: false };
    if (filters.status) where.status = filters.status as any;
    if (filters.customerName) where.customerName = { contains: filters.customerName, mode: 'insensitive' };
    if (filters.orderNumber) where.orderNumber = { contains: filters.orderNumber, mode: 'insensitive' };
    if (filters.modelId) where.modelId = filters.modelId;
    if (filters.orderDateFrom || filters.orderDateTo) {
      where.orderDate = {};
      if (filters.orderDateFrom) where.orderDate.gte = new Date(filters.orderDateFrom);
      if (filters.orderDateTo) where.orderDate.lte = new Date(filters.orderDateTo);
    }
    const [data, total] = await Promise.all([
      prisma.ordering.findMany({
        where, include: { model: { select: { id: true, name: true } }, orderEmployee: { select: { id: true, name: true } } },
        orderBy: { [pagination.sort]: pagination.order }, skip: pagination.skip, take: pagination.limit,
      }),
      prisma.ordering.count({ where }),
    ]);
    return { data, total };
  },

  async findById(id: number) {
    const o = await prisma.ordering.findUnique({
      where: { id },
      include: {
        model: true, orderEmployee: true, receiptEmployee: true, packagingEmployee: true, shippingEmployee: true,
        specifications: { include: { specification: true, specificationDetail: true } },
        checks: { include: { checkItemDetail: { include: { checkItem: true } }, checkEmployee: true } },
        files: true,
      },
    });
    if (!o || o.isDeleted) throw new AppError(404, 'NOT_FOUND', 'Ordering not found');
    return o;
  },

  async create(data: any, userId?: number) {
    const { specifications, checks, fileIds, ...orderData } = data;
    return prisma.ordering.create({
      data: {
        ...orderData,
        orderDate: orderData.orderDate ? new Date(orderData.orderDate) : undefined,
        dueDate: orderData.dueDate ? new Date(orderData.dueDate) : undefined,
        expectedDeliveryDate: orderData.expectedDeliveryDate ? new Date(orderData.expectedDeliveryDate) : undefined,
        createdBy: userId, updatedBy: userId,
        specifications: specifications?.length ? { create: specifications.map((s: any) => ({ specificationId: s.specificationId, specificationDetailId: s.specificationDetailId, basic: s.basic, significant: s.significant })) } : undefined,
        checks: checks?.length ? { create: checks.map((c: any) => ({ checkItemDetailId: c.checkItemDetailId, checkEmployeeId: c.checkEmployeeId })) } : undefined,
        files: fileIds?.length ? { connect: fileIds.map((id: number) => ({ id })) } : undefined,
      },
    });
  },

  async update(id: number, data: any, userId?: number) {
    const existing = await prisma.ordering.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) throw new AppError(404, 'NOT_FOUND', 'Ordering not found');
    if (existing.version !== data.version) throw new AppError(409, 'CONFLICT', 'Modified by another user');
    const { version, specifications, checks, fileIds, ...rest } = data;
    return prisma.ordering.update({
      where: { id },
      data: {
        ...rest,
        orderDate: rest.orderDate ? new Date(rest.orderDate) : undefined,
        dueDate: rest.dueDate ? new Date(rest.dueDate) : undefined,
        expectedDeliveryDate: rest.expectedDeliveryDate ? new Date(rest.expectedDeliveryDate) : undefined,
        updatedBy: userId, version: { increment: 1 },
      },
    });
  },

  async softDelete(id: number, userId?: number) {
    return prisma.ordering.update({ where: { id }, data: { status: 'DELETED', isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },

  async complete(id: number, userId?: number) {
    return prisma.ordering.update({ where: { id }, data: { status: 'COMPLETED', updatedBy: userId, version: { increment: 1 } } });
  },

  async recover(id: number, userId?: number) {
    return prisma.ordering.update({ where: { id }, data: { status: 'ACTIVE', isDeleted: false, updatedBy: userId, version: { increment: 1 } } });
  },

  async copy(id: number, userId?: number) {
    const original = await this.findById(id);
    const { id: _, createdAt, updatedAt, version, isDeleted, status, orderNumber, ...copyData } = original as any;
    const settings = await prisma.appSetting.findFirst();
    const newNumber = `ORD-${(settings?.lastOrderNumber ?? 0) + 1}`;
    if (settings) await prisma.appSetting.update({ where: { id: settings.id }, data: { lastOrderNumber: { increment: 1 } } });
    return prisma.ordering.create({ data: { ...copyData, orderNumber: newNumber, status: 'ACTIVE', createdBy: userId, updatedBy: userId, model: undefined, orderEmployee: undefined, receiptEmployee: undefined, packagingEmployee: undefined, shippingEmployee: undefined, specifications: undefined, checks: undefined, files: undefined, modelId: original.modelId, orderEmployeeId: original.orderEmployeeId, receiptEmployeeId: original.receiptEmployeeId, packagingEmployeeId: original.packagingEmployeeId, shippingEmployeeId: original.shippingEmployeeId } });
  },
};
