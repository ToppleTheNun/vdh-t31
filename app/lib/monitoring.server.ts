import * as Sentry from "@sentry/remix";

export function init() {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    tracesSampleRate: ENV.MODE === "production" ? 0.2 : 1.0,
    // TODO: Make this work with Prisma
    // integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
  });
}
