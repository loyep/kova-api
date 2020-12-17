import { Logger } from '@nestjs/common';

class LogData {
  public message?: string;
  public data?: any;
}

export class LoggerService {
  private readonly logger = new Logger('LoggerService', true);

  private writeLog(logMethod: string, logData: LogData) {
    logData = logData || { message: '', data: {} };
    // (logData as any).timeLocal = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    // logger[logMethod](logData);
    this.logger.log(typeof logData === 'object' ? JSON.stringify(logData) : logData);
  }

  debug(logData: LogData) {
    this.writeLog('debug', logData);
  }

  info(logData: LogData) {
    this.writeLog('info', logData);
  }

  error(logData: LogData) {
    this.writeLog('error', logData);
  }

  warn(logData: LogData) {
    this.writeLog('warn', logData);
  }

  fatal(logData: LogData) {
    this.writeLog('fatal', logData);
  }
}
