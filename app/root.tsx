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
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";
import { Analytics } from "@vercel/analytics/react";

import { TailwindIndicator } from "~/components/TailwindIndicator";
import fontStylesheetUrl from "~/font.css";
import { getEnv } from "~/lib/env.server";
import tailwindStylesheetUrl from "~/tailwind.css";
import { isPresent } from "~/typeGuards";
import { SiteFooter } from "~/components/SiteFooter";

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

function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html className="dark" lang="en" dir="auto">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background min-h-screen font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <SiteFooter />
        </div>
        <TailwindIndicator />
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
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <script
          src="https://wow.zamimg.com/js/tooltips.js"
          type="text/javascript"
        />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}

export default withSentry(App);
