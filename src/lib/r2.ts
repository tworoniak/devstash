import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';

// Custom agent: explicit TLS 1.2 min, keep-alive off — avoids handshake
// failures seen with SDK v3.750+ against Cloudflare R2.
const httpsAgent = new https.Agent({
  keepAlive: false,
  minVersion: 'TLSv1.2',
});

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // R2 requires path-style — virtual-hosted style causes TLS SNI failures
  forcePathStyle: true,
  // SDK v3.750+ adds checksum headers R2 does not support
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
  requestHandler: new NodeHttpHandler({ httpsAgent }),
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
