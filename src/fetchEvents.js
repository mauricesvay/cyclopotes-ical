import logger from './logger.js';

const DEFAULT_URL = 'https://cyclopotes.cc/events';

export async function fetchEvents() {
  const url = process.env.EVENT_URL || DEFAULT_URL;

  logger.info({ url }, 'Fetching events (POST)');
  
  // Fetch events for the current month and the next 2 months
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  
  const start = new Date(year, month, 1);
  // month + 3 gives us the end of the month 2 months ahead (e.g. Jan -> end of Mar)
  const end = new Date(year, month + 3, 0);
  
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
