import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../../config/prisma';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';
import { randomUUID } from 'crypto';
import path from 'path';

// Cloudflare R2 (S3-compatible API)
const r2 = config.r2.accountId
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2.accessKeyId,
        secretAccessKey: config.r2.secretAccessKey,
      },
    })
  : null;

export const fileService = {
  async upload(file: Express.Multer.File, userId?: number) {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const key = `uploads/${filename}`;

    let url = `/uploads/${filename}`;

    if (r2) {
      await r2.send(
        new PutObjectCommand({
          Bucket: config.r2.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      url = config.r2.publicUrl
        ? `${config.r2.publicUrl}/${key}`
        : `https://${config.r2.bucket}.${config.r2.accountId}.r2.dev/${key}`;
    }

    const fileEntity = await prisma.fileEntity.create({
      data: {
        url,
        filename,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        size: BigInt(file.size),
      },
    });

    return { ...fileEntity, size: Number(fileEntity.size) };
  },

  async delete(id: number) {
    const file = await prisma.fileEntity.findUnique({ where: { id } });
    if (!file) throw new AppError(404, 'NOT_FOUND', 'File not found');

    if (r2 && (file.url.includes('r2.dev') || file.url.includes(config.r2.publicUrl))) {
      const urlParts = file.url.split('/');
      const key = urlParts.slice(-2).join('/'); // uploads/filename
      await r2.send(new DeleteObjectCommand({ Bucket: config.r2.bucket, Key: key }));
    }

    await prisma.fileEntity.delete({ where: { id } });
    return { message: 'Deleted' };
  },
};
