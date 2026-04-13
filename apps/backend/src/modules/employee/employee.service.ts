import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { PaginationOptions } from '../../utils/pagination';
import { EmployeeCreateInput, EmployeeUpdateInput } from './employee.validator';

export const employeeService = {
  async findAll(
    pagination: PaginationOptions,
    filters: {
      name?: string;
      department?: string;
      employmentStatus?: string;
      headquarter?: string;
    },
  ) {
    const where: Prisma.EmployeeWhereInput = { isDeleted: false };

    if (filters.name) where.name = { contains: filters.name, mode: 'insensitive' };
    if (filters.department) where.department = filters.department as any;
    if (filters.employmentStatus) where.employmentStatus = filters.employmentStatus as any;
    if (filters.headquarter) where.headquarter = filters.headquarter as any;

    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { [pagination.sort]: pagination.order },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.employee.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: number) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee || employee.isDeleted) {
      throw new AppError(404, 'NOT_FOUND', 'Employee not found');
    }
    return employee;
  },

  async create(data: EmployeeCreateInput, userId?: number) {
    const exists = await prisma.employee.findUnique({
      where: { employeeNumber: data.employeeNumber },
    });
    if (exists) {
      throw new AppError(409, 'CONFLICT', 'Employee number already exists');
    }

    return prisma.employee.create({
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  },

  async update(id: number, data: EmployeeUpdateInput, userId?: number) {
    const existing = await this.findById(id);
    if (existing.version !== data.version) {
      throw new AppError(409, 'CONFLICT', 'Data has been modified by another user');
    }

    const { version, ...updateData } = data;
    return prisma.employee.update({
      where: { id },
      data: {
        ...updateData,
        birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
        joinDate: updateData.joinDate ? new Date(updateData.joinDate) : undefined,
        updatedBy: userId,
        version: { increment: 1 },
      },
    });
  },

  async softDelete(id: number, userId?: number) {
    await this.findById(id);
    return prisma.employee.update({
      where: { id },
      data: { isDeleted: true, updatedBy: userId, version: { increment: 1 } },
    });
  },

  async recover(id: number, userId?: number) {
    return prisma.employee.update({
      where: { id },
      data: { isDeleted: false, updatedBy: userId, version: { increment: 1 } },
    });
  },

  async checkEmployeeNumber(employeeNumber: string) {
    const exists = await prisma.employee.findUnique({ where: { employeeNumber } });
    return { exists: !!exists };
  },
};
