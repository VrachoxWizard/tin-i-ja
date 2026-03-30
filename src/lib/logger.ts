/**
 * Structured logger for API routes.
 * Adds timestamp, request path, and a unique request ID for traceability.
 */

function generateRequestId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

interface LogContext {
  requestId?: string;
  path?: string;
  [key: string]: unknown;
}

function formatMessage(
  level: string,
  message: string,
  context: LogContext
): string {
  const ts = new Date().toISOString();
  const rid = context.requestId || "unknown";
  const path = context.path || "";
  return `[${ts}] [${level}] [${rid}] ${path ? `${path} — ` : ""}${message}`;
}

export function createRequestLogger(path: string) {
  const requestId = generateRequestId();

  return {
    requestId,
    info(message: string, extra?: Record<string, unknown>) {
      console.log(formatMessage("INFO", message, { requestId, path, ...extra }));
    },
    warn(message: string, extra?: Record<string, unknown>) {
      console.warn(formatMessage("WARN", message, { requestId, path, ...extra }));
    },
    error(message: string, error?: unknown, extra?: Record<string, unknown>) {
      console.error(
        formatMessage("ERROR", message, { requestId, path, ...extra }),
        error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error
      );
    },
  };
}
