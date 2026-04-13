export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'dhs-erp-jwt-secret',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '12h',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'ap-northeast-2',
    s3Bucket: process.env.AWS_S3_BUCKET || 'dhs-file-bucket',
  },
} as const;
