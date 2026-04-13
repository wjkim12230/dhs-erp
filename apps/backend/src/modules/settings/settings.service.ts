import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';

export const settingsService = {
  async get() {
    const s = await prisma.appSetting.findFirst();
    if (!s) throw new AppError(404, 'NOT_FOUND', 'Settings not found');
    return s;
  },
  async update(data: { defaultLocale?: string; international?: boolean; lastOrderNumber?: number }) {
    const existing = await prisma.appSetting.findFirst();
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Settings not found');
    return prisma.appSetting.update({ where: { id: existing.id }, data });
  },
};
