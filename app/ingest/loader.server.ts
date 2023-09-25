import { json, type LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { serverTiming } from "~/constants";
import { ingestWarcraftLogsReport } from "~/ingest/log.server";
import type { Timings } from "~/lib/timing.server";
import { getServerTimeHeader } from "~/lib/timing.server";
import { getReportCode } from "~/utils";
import { error } from "~/lib/log.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.reportCode, "Missing reportCode param");
  const reportCode = getReportCode(params.reportCode);
  if (!reportCode) {
    error("Not found!");
    throw new Response("Not Found", { status: 404 });
  }
  const timings: Timings = {};
  const ingested = await ingestWarcraftLogsReport(reportCode, timings);
  return json(
    { ingested, reportCode },
    { headers: { [serverTiming]: getServerTimeHeader(timings) } },
  );
};
