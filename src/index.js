import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import http from 'http';
import logger from './logger.js';
import { fetchEvents } from './fetchEvents.js';
import { generateIcal } from './generateIcal.js';
import { uploadToS3 } from './s3Upload.js';

async function getIcalContent() {
  const events = await fetchEvents();
  logger.info({ count: events.length }, 'Events fetched');
  return generateIcal(events, { name: 'cyclopotes' });
}

async function runBatch() {
  try {
    logger.info('Starting cyclopotes-ical batch process');

    const ics = await getIcalContent();

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

async function startServer() {
  const port = process.env.PORT || 3000;

  const server = http.createServer(async (req, res) => {
    logger.info({ method: req.method, url: req.url }, 'Incoming request');

    if (req.method === 'GET' && (req.url === '/' || req.url.startsWith('/calendar'))) {
      try {
        const ics = await getIcalContent();
        res.writeHead(200, {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename="cyclopotes.ics"'
        });
        res.end(ics);
      } catch (err) {
        logger.error({ err }, 'Error serving iCal');
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  server.listen(port, () => {
    logger.info({ port }, 'Server listening');
  });
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('src/index.js')) {
  if (process.env.HTTP_SERVER === 'true') {
    startServer();
  } else {
    runBatch();
  }
}

export { runBatch, startServer };
