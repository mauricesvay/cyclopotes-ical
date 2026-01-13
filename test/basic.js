import { generateIcal } from '../src/generateIcal.js';
import fs from 'fs/promises';

(async () => {
  try {
    // Read sample events directly for testing
    const raw = await fs.readFile(new URL('../events.json', import.meta.url), 'utf-8');
    const events = JSON.parse(raw);
    const ics = generateIcal(events);
    if (!ics.includes('BEGIN:VCALENDAR') || !ics.includes('BEGIN:VEVENT')) {
      console.error('FAIL: generated ICS does not include expected tokens');
      process.exit(1);
    }
    console.log('PASS: ICS generated — events=', events.length);
  } catch (err) {
    console.error('FAIL', err);
    process.exit(1);
  }
})();
