export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'dhs-erp-jwt-secret',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '12h',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || 'dhs-files',
    publicUrl: process.env.R2_PUBLIC_URL || '', // Custom domain or R2 public URL
  },
} as const;
