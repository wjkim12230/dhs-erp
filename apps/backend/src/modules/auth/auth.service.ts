import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';
import { JwtPayload } from '../../middleware/auth';

export const authService = {
  async login(loginId: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { loginId } });
    if (!admin || admin.isDeleted || !admin.isEnabled) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid login ID or password');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid login ID or password');
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginDate: new Date() },
    });

    const payload: JwtPayload = {
      id: admin.id,
      loginId: admin.loginId,
      name: admin.name,
      role: admin.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiry,
    });
    const refreshToken = jwt.sign({ id: admin.id }, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiry,
    });

    return {
      accessToken,
      refreshToken,
      user: { id: admin.id, loginId: admin.loginId, name: admin.name, role: admin.role },
    };
  },

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as { id: number };
      const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
      if (!admin || admin.isDeleted || !admin.isEnabled) {
        throw new AppError(401, 'UNAUTHORIZED', 'Invalid refresh token');
      }

      const payload: JwtPayload = {
        id: admin.id,
        loginId: admin.loginId,
        name: admin.name,
        role: admin.role,
      };

      const accessToken = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.accessExpiry,
      });

      return { accessToken };
    } catch {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid refresh token');
    }
  },

  async getMe(userId: number) {
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
      select: { id: true, loginId: true, name: true, role: true },
    });
    if (!admin) throw new AppError(404, 'NOT_FOUND', 'User not found');
    return admin;
  },
};
