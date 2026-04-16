type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Enhanced Logger Utility for WITHUS
 */
class Logger {
  private format(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  info(message: string, ...args: any[]) {
    console.info(this.format("info", message), ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(this.format("warn", message), ...args);
  }

  error(message: string, error?: any, ...args: any[]) {
    console.error(this.format("error", message), error, ...args);
  }

  debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("debug", message), ...args);
    }
  }
}

export const logger = new Logger();
