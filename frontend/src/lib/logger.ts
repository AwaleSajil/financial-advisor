/**
 * Tagged logger for debugging.
 * All logs go to console.log/warn/error which Expo Go
 * automatically forwards to the Metro terminal.
 *
 * Usage:
 *   const log = createLogger("Auth");
 *   log.info("login attempt", { email });
 *   log.error("login failed", error);
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const ENABLED = __DEV__; // only log in development

function formatArgs(args: unknown[]): unknown[] {
  return args.map((a) => {
    if (a instanceof Error) return `${a.message}\n${a.stack}`;
    if (typeof a === "object" && a !== null) {
      try {
        return JSON.stringify(a, null, 2);
      } catch {
        return a;
      }
    }
    return a;
  });
}

function log(level: LogLevel, tag: string, message: string, ...args: unknown[]) {
  if (!ENABLED) return;

  const timestamp = new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
  const prefix = `[${timestamp}] [${level}] [${tag}]`;
  const formatted = formatArgs(args);

  switch (level) {
    case "ERROR":
      console.error(prefix, message, ...formatted);
      break;
    case "WARN":
      console.warn(prefix, message, ...formatted);
      break;
    default:
      console.log(prefix, message, ...formatted);
      break;
  }
}

export function createLogger(tag: string) {
  return {
    debug: (message: string, ...args: unknown[]) => log("DEBUG", tag, message, ...args),
    info: (message: string, ...args: unknown[]) => log("INFO", tag, message, ...args),
    warn: (message: string, ...args: unknown[]) => log("WARN", tag, message, ...args),
    error: (message: string, ...args: unknown[]) => log("ERROR", tag, message, ...args),
  };
}
