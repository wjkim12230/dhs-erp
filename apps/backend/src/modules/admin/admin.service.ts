import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { PaginationOptions } from '../../utils/pagination';

export const adminService = {
  async findAll(pagination: PaginationOptions) {
    const where = { isDeleted: false };
    const [data, total] = await Promise.all([
      prisma.admin.findMany({ where, select: { id: true, loginId: true, name: true, role: true, isEnabled: true, lastLoginDate: true, createdAt: true, updatedAt: true, version: true, isDeleted: true, createdBy: true, updatedBy: true }, orderBy: { [pagination.sort]: pagination.order }, skip: pagination.skip, take: pagination.limit }),
      prisma.admin.count({ where }),
    ]);
    return { data, total };
  },
  async create(data: { loginId: string; name: string; password: string; role: any }, userId?: number) {
    const exists = await prisma.admin.findUnique({ where: { loginId: data.loginId } });
    if (exists) throw new AppError(409, 'CONFLICT', 'Login ID already exists');
    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.admin.create({ data: { ...data, password: hashed, createdBy: userId, updatedBy: userId } });
  },
  async delete(id: number, userId?: number) {
    return prisma.admin.update({ where: { id }, data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } } });
  },
  async resetPassword(id: number, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.admin.update({ where: { id }, data: { password: hashed, passwordUpdatedDate: new Date(), version: { increment: 1 } } });
  },
};
