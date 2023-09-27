import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { serverTiming } from "~/constants";
import { ingestWarcraftLogsReport } from "~/ingest/log.server";
import { error } from "~/lib/log.server";
import type { Timings } from "~/lib/timing.server";
import { getServerTimeHeader } from "~/lib/timing.server";
import { getReportCode } from "~/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.reportCode, "Missing reportCode param");
  const reportCode = getReportCode(params.reportCode);
  if (!reportCode) {
    error("Not found!");
    throw new Response("Not Found", { status: 404 });
  }
  const timings: Timings = {};
  const ingested = ingestWarcraftLogsReport(reportCode, timings);
  return defer(
    { ingested, reportCode },
    { headers: { [serverTiming]: getServerTimeHeader(timings) } },
  );
};
