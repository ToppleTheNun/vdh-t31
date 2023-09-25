import type { IngestedReportFight, ReportWithIngestedFights } from "~/ingest/types";
import { formatDuration } from "~/utils";

const NEWLINE_CHARACTER = "\n";
const TAB_CHARACTER = "\t";

const formatIngestedReportFightAsTSV = (fight: IngestedReportFight): string => {
  const duration = formatDuration(fight.endTime - fight.startTime);
  const wclLink = `https://www.warcraftlogs.com/reports/${fight.reportID}#fight=${fight.id}`;

  return fight.procs
    .map((proc) => [
      proc.name,
      wclLink,
      '', // precise/concentrated
      '', // number of points in ES
      'FALSE', // Quickened Sigils,
      duration,
      '', // number of targets,
      `${proc.ticks}`,
      `${proc.procs}`
    ].join(TAB_CHARACTER))
    .join(NEWLINE_CHARACTER);
};

export const formatAsTSV = (report: ReportWithIngestedFights): string =>
  report.ingestedFights
    .map(formatIngestedReportFightAsTSV)
    .join(NEWLINE_CHARACTER);
