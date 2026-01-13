import { fetchEvents } from '../src/fetchEvents.js';
import { generateIcal } from '../src/generateIcal.js';

(async () => {
  try {
    process.env.USE_LOCAL_EVENTS = '1';
    const events = await fetchEvents();
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
