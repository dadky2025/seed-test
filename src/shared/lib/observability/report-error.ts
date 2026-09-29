/** The single place errors are sent. Sentry or the console; call sites never import a vendor SDK. */
export function reportError(error: unknown, context?: Record<string, string>): void {
  console.error(error, context);
}
