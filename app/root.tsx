import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import { Analytics } from "@vercel/analytics/react";

import { SiteFooter } from "~/components/SiteFooter";
import { TailwindIndicator } from "~/components/TailwindIndicator";
import fontStylesheetUrl from "~/font.css";
import { getEnv } from "~/lib/env.server";
import tailwindStylesheetUrl from "~/tailwind.css";
import { isPresent } from "~/typeGuards";
import { ReactNode } from "react";
import { IngestForm } from "~/components/IngestForm";
import { ErrorPageHeader } from "~/components/PageHeader";
import { PageLayout } from "~/components/PageLayout";
import { H2, Lead } from "~/components/typography";

export const links: LinksFunction = () => {
  return [
    // Preload CSS as a resource to avoid render blocking
    { rel: "preload", href: fontStylesheetUrl, as: "style" },
    { rel: "preload", href: tailwindStylesheetUrl, as: "style" },
    cssBundleHref ? { rel: "preload", href: cssBundleHref, as: "style" } : null,

    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
    { rel: "manifest", href: "/site.webmanifest" },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },

    // These should match the css preloads above to avoid css as render blocking resource
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    cssBundleHref ? { rel: "stylesheet", href: cssBundleHref } : null,
  ].filter(isPresent);
};

const title = "VDH T31";

export const meta: MetaFunction = () => {
  const url = "https://vdh-t31.vercel.app/";
  const description = "Vengeance Demon Hunter T31 log automatic parser.";

  return [
    { title },
    { property: "og:url", content: url },
    { property: "twitter:url", content: url },
    { property: "image:alt", content: title },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:site_name", content: title },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: `${url}logo.webp` },
    { property: "og:image:alt", content: title },
    { property: "og:description", content: description },
    { property: "twitter:description", content: description },
    { property: "twitter:creator", content: "@ToppleTheNun" },
    { property: "twitter:title", content: title },
    { property: "twitter:image", content: `${url}logo.webp` },
    { property: "twitter:image:alt", content: title },
    { property: "twitter:card", content: "summary" },
    { property: "description", content: description },
    { property: "name", content: title },
    { property: "author", content: "Richard Harrah" },
    { property: "revisit-after", content: "7days" },
    { property: "distribution", content: "global" },
    { property: "msapplication-TileColor", content: "#da532c" },
    { property: "theme-color", content: "#ffffff" },
  ];
};

export const loader = () => {
  return json({
    ENV: getEnv(),
  });
};

const Document = ({ children }: { children: ReactNode }) => {
  return (
    <html className="dark" lang="en" dir="auto">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        {children}
        <TailwindIndicator />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  captureRemixErrorBoundaryError(error);

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <PageLayout>
              <ErrorPageHeader />
              <div className="pb-12 pt-8">
                <H2>
                  {error.status} {error.statusText}
                </H2>
                <Lead>{error.data}</Lead>
              </div>
            </PageLayout>
          </div>
          <SiteFooter />
        </div>
      </Document>
    );
  }

  if (error instanceof Error) {
    return (
      <Document>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <PageLayout>
              <ErrorPageHeader />
              <div className="pb-12 pt-8">
                <H2>Error</H2>
                <Lead>{error.message}</Lead>
                <Lead>Stack Trace</Lead>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {error.stack}
                </code>
              </div>
            </PageLayout>
          </div>
          <SiteFooter />
        </div>
      </Document>
    );
  }

  return (
    <Document>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <PageLayout>
            <ErrorPageHeader />
            <div className="pb-12 pt-8">
              <H2>Unknown Error</H2>
              <Lead>
                If you&apos;re seeing this, bug Topple relentlessly until he
                fixes this.
              </Lead>
            </div>
          </PageLayout>
        </div>
        <SiteFooter />
      </div>
    </Document>
  );
};

function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <Document>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
      <ScrollRestoration />
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
        const whTooltips = { colorLinks: true, iconizeLinks: true };
        `,
        }}
      />
      <script
        src="https://wow.zamimg.com/js/tooltips.js"
        type="text/javascript"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
        }}
      />
      <Analytics />
    </Document>
  );
}

export default withSentry(App);
