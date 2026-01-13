import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import logger from './logger.js';

const REGION = process.env.AWS_REGION || 'eu-west-1';
const s3Client = new S3Client({ region: REGION });

export async function uploadToS3({ bucket, key, body, contentType = 'text/calendar' }) {
  if (!bucket) throw new Error('S3_BUCKET is required to upload file');
  if (!key) throw new Error('S3_KEY is required to upload file');

  logger.info({ bucket, key }, 'Uploading iCal to S3');

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: 'public-read'
  });

  await s3Client.send(cmd);

  // Basic public URL (works for most standard buckets)
  const url = `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`;
  logger.info({ url }, 'Upload complete');
  return url;
}

export default uploadToS3;
