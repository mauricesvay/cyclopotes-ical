import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import logger from './logger.js';
import { fetchEvents } from './fetchEvents.js';
import { generateIcal } from './generateIcal.js';
import { uploadToS3 } from './s3Upload.js';

async function main() {
  try {
    logger.info('Starting cyclopotes-ical process');

    const events = await fetchEvents();
    logger.info({ count: events.length }, 'Events fetched');

    const ics = generateIcal(events, { name: 'cyclopotes' });

    const outPath = process.env.OUT_FILE || './out.ics';
    await fs.writeFile(outPath, ics, 'utf-8');
    logger.info({ outPath }, 'iCal file written');

    const bucket = process.env.S3_BUCKET;
    const key = process.env.S3_KEY || path.basename(outPath);

    if (bucket) {
      const url = await uploadToS3({ bucket, key, body: ics });
      logger.info({ url }, 'iCal uploaded to S3');
    } else {
      logger.info('S3_BUCKET not set — skipping upload');
    }

    logger.info('Process finished successfully');
  } catch (err) {
    logger.error({ err }, 'Fatal error');
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('src/index.js')) {
  main();
}

export default main;
