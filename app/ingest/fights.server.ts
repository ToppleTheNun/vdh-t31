import type {
  IngestedReportFight,
  IngestibleReportFight,
  Report,
  ReportFight,
  ReportWithIngestedFights,
  SigilOfFlameProcs,
} from "~/ingest/types";
import { debug, error } from "~/lib/log.server";
import type { Timings } from "~/lib/timing.server";
import { time } from "~/lib/timing.server";
import { isPresent } from "~/typeGuards";
import { typedKeys } from "~/utils";
import { getFights, getTable } from "~/wcl/queries";
import { type DamageDoneTable, damageDoneTableSchema } from "~/wcl/schema";

const getBasicReport = async (
  reportID: string,
  timings: Timings,
): Promise<Report | null> => {
  const rawFightData = await time(() => getFights({ reportID }), {
    type: "wcl.query.getFights",
    timings,
  });
  if (!rawFightData.reportData || !rawFightData.reportData.report) {
    return null;
  }

  const fights = rawFightData.reportData.report.fights;
  const reportStartTime = rawFightData.reportData.report.startTime;
  const reportEndTime = rawFightData.reportData.report.endTime;
  const title = rawFightData.reportData.report.title;
  if (!isPresent(fights)) {
    return null;
  }

  const reportFights = fights.filter(isPresent).map<ReportFight>((fight) => ({
    id: fight.id,
    reportID,
    startTime: reportStartTime + fight.startTime,
    endTime: reportStartTime + fight.endTime,
  }));

  return {
    id: reportID,
    title,
    startTime: reportStartTime,
    endTime: reportEndTime,
    reportFights: reportFights,
  };
};

const calculateSigilOfFlameProcs = (
  tickData: DamageDoneTable,
  procData: DamageDoneTable,
): SigilOfFlameProcs[] => {
  const tickDataByName = tickData.entries.reduce(
    (acc, val) => ({ ...acc, [val.name]: val.tickCount }),
    {} as Record<string, number>,
  );
  const procDataByName = procData.entries.reduce(
    (acc, val) => ({ ...acc, [val.name]: val.hitCount }),
    {} as Record<string, number>,
  );

  debug("calculateSigilOfFlameProcs - tickDataByName", tickDataByName);
  debug("calculateSigilOfFlameProcs - procDataByName", procDataByName);

  return (
    typedKeys(procDataByName)
      .map<SigilOfFlameProcs>((name) => ({
        name,
        ticks: tickDataByName[name] ?? 0,
        procs: procDataByName[name] ?? 0,
      }))
      // ensure we only keep data where they both ticked and proc-ed
      .filter((it) => it.procs > 0 && it.ticks > 0)
  );
};

const getTableData = async (
  reportID: string,
  fightID: number,
  spellID: number,
  timings: Timings,
): Promise<DamageDoneTable | undefined> => {
  const query = await time(
    () =>
      getTable({
        reportID,
        fightIDs: [fightID],
        spellID,
      }),
    { type: `wcl.query.getTable.${spellID}`, timings },
  );
  const table = query.reportData?.report?.table?.data;
  if (!table) {
    error(
      `Unable to retrieve table for reportID=${reportID} fightID=${fightID} spellID=${spellID}`,
    );
    return undefined;
  }
  debug("table=", JSON.stringify(table));
  const parsed = await time(() => damageDoneTableSchema.safeParseAsync(table), {
    type: `zod.safeParseAsync.damageDoneTableSchema.${spellID}`,
    timings,
  });
  if (!parsed.success) {
    error("Unable to parse table data", parsed.error.flatten());
    return undefined;
  }
  debug("parsed=", parsed);
  return parsed.data;
};

const ingestFight = async (
  reportFight: IngestibleReportFight,
  timings: Timings,
): Promise<IngestedReportFight> => {
  const tickData = await getTableData(
    reportFight.reportID,
    reportFight.id,
    204598,
    timings,
  );
  if (!tickData) {
    return { ...reportFight, procs: [] };
  }

  const procData = await getTableData(
    reportFight.reportID,
    reportFight.id,
    425672,
    timings,
  );
  if (!procData) {
    return { ...reportFight, procs: [] };
  }

  const procs = await time(
    () => calculateSigilOfFlameProcs(tickData, procData),
    { type: "calculateSigilOfFlameProcs", timings },
  );

  return { ...reportFight, procs };
};

const ingestFights = (fights: IngestibleReportFight[], timings: Timings) =>
  Promise.all(fights.map((fight) => ingestFight(fight, timings)));

export const ingestFightsFromReport = async (
  reportID: string,
  timings: Timings,
): Promise<ReportWithIngestedFights | null> => {
  const basicReport = await getBasicReport(reportID, timings);
  if (!basicReport) {
    return null;
  }

  const ingestibleFights = basicReport.reportFights;

  const ingestedFights = await ingestFights(ingestibleFights, timings);

  return { ...basicReport, ingestibleFights, ingestedFights };
};
