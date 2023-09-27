import { ingestFightsFromReport } from "~/ingest/fights.server";
import { formatAsTSV } from "~/ingest/format.server";
import { debug, info } from "~/lib/log.server";
import type { Timings } from "~/lib/timing.server";
import { time } from "~/lib/timing.server";

export const ingestWarcraftLogsReport = async (
  reportCode: string,
  timings: Timings,
) => {
  info(`Ingesting WCL report: ${reportCode}`);
  const fights = await ingestFightsFromReport(reportCode, timings);
  debug(
    `Ingested fights from ${reportCode}:`,
    fights?.ingestedFights?.map((fight) => fight.id)?.join(", "),
  );
  if (!fights) {
    throw new Error("No fights returned from WCL API!");
  }
  return time(() => formatAsTSV(fights), { type: "formatAsTSV", timings });
};
