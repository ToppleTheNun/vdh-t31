import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { reportWebVitalsToVercelAnalytics } from "~/lib/vitals.client";

if (ENV.MODE === "production" && ENV.SENTRY_DSN) {
  import("./lib/monitoring.client").then(({ init }) => init());
}

const hydrate = () =>
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}

reportWebVitalsToVercelAnalytics();
