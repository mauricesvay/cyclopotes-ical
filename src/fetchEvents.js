import fs from 'fs/promises';
import logger from './logger.js';

const DEFAULT_URL = 'https://cyclopotes.cc/events';

export async function fetchEvents() {
  const url = process.env.EVENT_URL || DEFAULT_URL;
  if (process.env.USE_LOCAL_EVENTS === '1') {
    logger.info('Using local events.json');
    const raw = await fs.readFile(new URL('../events.json', import.meta.url), 'utf-8');
    return JSON.parse(raw);
  }

  logger.info({ url }, 'Fetching events (POST)');
  // The POST body filters for the current month by default:
  // { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD', types: [1,2,3], distance: [0,300], elevation_gain: [0,3000], status: [1,2,3] }
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const format = (d) => d.toISOString().slice(0, 10);
  const defaultBody = {
    start: format(start),
    end: format(end),
    types: [1, 2, 3],
    distance: [0, 300],
    elevation_gain: [0, 3000],
    status: [1, 2, 3]
  };
  const postBody = JSON.stringify(defaultBody);
  logger.info({ postBody }, 'POST body');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: postBody
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default fetchEvents;
