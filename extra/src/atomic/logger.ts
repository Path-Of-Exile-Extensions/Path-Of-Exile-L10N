enum Level {
  none,
  log,
  info,
  warn,
  error,
  debug,
}

export class JustLogger {
  private level: Level
  private label: string

  // 单例
  // 单例
  private static instance: JustLogger;

  static get Instance(): JustLogger {
    if (!JustLogger.instance) {
      JustLogger.instance = new JustLogger('[POE-I10N]', Level.debug);
    }
    return JustLogger.instance;
  }

  // 改变日志级别
  changeLevel(level: Level) {
    this.level = level;
  }

  constructor(label: string, level: Level = Level.none) {
    this.label = label;
    this.level = level;
  }

  log(...args: any[]) {
    if (this.level >= Level.log) {
      console.log(`${this.label}`, ...args);
    }
  }

  info(...args: any[]) {
    if (this.level >= Level.info) {
      console.info(`${this.label}`, ...args);
    }
  }

  warn(...args: any[]) {
    if (this.level >= Level.warn) {
      console.warn(`${this.label}`, ...args);
    }
  }

  error(...args: any[]) {
    if (this.level >= Level.error) {
      console.error(`${this.label}`, ...args);
    }
  }

  debug(...args: any[]) {
    if (this.level >= Level.debug) {
      console.debug(`${this.label}`, ...args);
    }
  }
}
