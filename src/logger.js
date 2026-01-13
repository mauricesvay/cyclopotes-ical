import pino from 'pino';

const logFile = process.env.LOG_FILE;
const level = process.env.LOG_LEVEL || 'info';
let logger;
if (logFile) {
  // pino.destination accepts a file path
  const dest = pino.destination({ dest: logFile, sync: false });
  logger = pino({ level }, dest);
} else {
  logger = pino({ level });
}

export default logger;
