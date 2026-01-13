import ical from 'ical-generator';
import logger from './logger.js';

// Default duration in milliseconds (2 hours)
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export function generateIcal(events, { name = 'cyclopotes', timezone = process.env.TZ } = {}) {
  const cal = ical({ name, timezone });

  (events || []).forEach((ev) => {
    try {
      const start = ev.date ? new Date(ev.date) : null;
      if (!start) return;

      const groupName = ev.group && ev.group.name ? ev.group.name : ev.name || 'Event';
      const summary = groupName;

      let descParts = [];
      if (ev.group && ev.group.description) descParts.push(ev.group.description);
      if (ev.description) descParts.push(ev.description);
      if (ev.group && ev.group.url) descParts.push(`URL: ${ev.group.url}`);
      const description = descParts.join('\n\n');

      const end = new Date(start.getTime() + DEFAULT_DURATION_MS);

      cal.createEvent({
        start,
        end,
        summary,
        description,
        uid: ev.id || undefined
      });
    } catch (err) {
      logger.warn({ err, event: ev && ev.id }, 'Failed to convert an event to iCal');
    }
  });

  return cal.toString();
}

export default generateIcal;
