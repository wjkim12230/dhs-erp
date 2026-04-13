import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '../../config/prisma';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';
import { randomUUID } from 'crypto';
import path from 'path';

const s3 = new S3Client({
  region: config.aws.region,
  credentials: config.aws.accessKeyId
    ? { accessKeyId: config.aws.accessKeyId, secretAccessKey: config.aws.secretAccessKey }
    : undefined,
});

export const fileService = {
  async upload(file: Express.Multer.File, userId?: number) {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const key = `uploads/${filename}`;

    // If AWS credentials are configured, upload to S3
    if (config.aws.accessKeyId) {
      await s3.send(
        new PutObjectCommand({
          Bucket: config.aws.s3Bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    }

    const url = config.aws.accessKeyId
      ? `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`
      : `/uploads/${filename}`;

    const fileEntity = await prisma.fileEntity.create({
      data: {
        url,
        filename,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        size: BigInt(file.size),
      },
    });

    return {
      ...fileEntity,
      size: Number(fileEntity.size),
    };
  },

  async delete(id: number) {
    const file = await prisma.fileEntity.findUnique({ where: { id } });
    if (!file) throw new AppError(404, 'NOT_FOUND', 'File not found');

    if (config.aws.accessKeyId && file.url.includes('amazonaws.com')) {
      const key = file.url.split('.com/')[1];
      if (key) {
        await s3.send(new DeleteObjectCommand({ Bucket: config.aws.s3Bucket, Key: key }));
      }
    }

    await prisma.fileEntity.delete({ where: { id } });
    return { message: 'Deleted' };
  },

  async getPresignedUrl(filename: string) {
    const ext = path.extname(filename);
    const key = `uploads/${randomUUID()}${ext}`;

    const url = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: config.aws.s3Bucket, Key: key }),
      { expiresIn: 3600 },
    );

    return {
      uploadUrl: url,
      fileUrl: `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`,
      key,
    };
  },
};
