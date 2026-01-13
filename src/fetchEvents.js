import fs from 'fs/promises';
import logger from './logger.js';

const DEFAULT_URL = 'https://cyclopotes.cc/event';

export async function fetchEvents() {
  const url = process.env.EVENT_URL || DEFAULT_URL;
  if (process.env.USE_LOCAL_EVENTS === '1') {
    logger.info('Using local events.json');
    const raw = await fs.readFile(new URL('../events.json', import.meta.url), 'utf-8');
    return JSON.parse(raw);
  }

  logger.info({ url }, 'Fetching events');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default fetchEvents;
