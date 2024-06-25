import winston from 'winston';
import { isEmpty, safeToString } from './utils';
import Transport from 'winston-transport';

export const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    const output = Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );

    return output;
  }
  return info;
});

export const { timestamp, combine, colorize, printf } = winston.format;

export function createConsoleTransport(): Transport {
  return new winston.transports.Console({
    format: combine(
      colorize(),
      printf((info) => {
        const { timestamp, level, message, ...extra } = info;
        return (
          `${timestamp} [${level}]: ${isEmpty(message) ? ' ' : safeToString(message)}` +
          (isEmpty(extra) ? '' : ` | ${safeToString(extra)}`)
        );
      }),
    ),
    stderrLevels: ['error'],
  });
}

export function createFileTransport(appName: string, env: string): Transport {
  return new winston.transports.File({
    filename: `${appName}-${env}.txt`,
    level: 'info',
    format: combine(
      printf((info) => {
        const { timestamp, level, message, ...extra } = info;
        return (
          `${timestamp} [${level}]: ${isEmpty(message) ? ' ' : safeToString(message)}` +
          (isEmpty(extra) ? '' : ` | ${safeToString(extra)}`)
        );
      }),
    ),
  });
}

export function createTransports(useFile: boolean, appName: string, env: string): Transport[] {
  const transports = [createConsoleTransport()];
  if (useFile === true) {
    transports.push(createFileTransport(appName, env));
  }
  return transports;
}
