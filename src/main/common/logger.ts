import winston, { format } from 'winston';
import * as path from 'path';
import { consoleColor } from './console-color';
import { appConfig } from '../config';
import * as fs from 'fs';

export const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.splat(), format.simple()),
  defaultMeta: { service: 'MyShortcut' },
});

if (appConfig.isDev) {
  logger.add(
    new winston.transports.Console({
      format: format.printf(({ level, message }) => {
        return `${consoleColor.FgGreen}${level}:${consoleColor.FgWhite} ${message}`;
      }),
    }),
  );
}
if (!fs.existsSync(appConfig.logFolder)) {
  fs.mkdir(appConfig.logFolder, { recursive: true }, (err) => {
    logger.info('Create log path result', err);
  });
}
const combinedFile = path.join(appConfig.logFolder, './combined.log');
logger.add(new winston.transports.File({ filename: combinedFile }));
