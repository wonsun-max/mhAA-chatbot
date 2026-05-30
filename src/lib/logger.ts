type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Enhanced Logger Utility for WITHUS
 */
class Logger {
  private format(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * Logs an informational message.
   * Uses unknown[] instead of any[] to ensure type-safety when handling log parameters.
   */
  info(message: string, ...args: unknown[]) {
    console.info(this.format("info", message), ...args);
  }

  /**
   * Logs a warning message.
   * Parameters are typed as unknown[] to prevent uncontrolled type propagation.
   */
  warn(message: string, ...args: unknown[]) {
    console.warn(this.format("warn", message), ...args);
  }

  /**
   * Logs an error message.
   * Uses unknown for error type to handle native Error objects or custom error structures uniformly without bypassing compiler checks.
   */
  error(message: string, error?: unknown, ...args: unknown[]) {
    console.error(this.format("error", message), error, ...args);
  }

  /**
   * Logs a debug message, which is disabled in production environments to minimize overhead.
   */
  debug(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("debug", message), ...args);
    }
  }
}

export const logger = new Logger();
