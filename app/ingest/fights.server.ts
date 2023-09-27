import type {
  IngestedReportFight,
  IngestibleReportFight,
  Report,
  ReportFight,
  ReportWithIngestedFights,
  ReportWithIngestibleFights,
  SigilOfFlameProcs,
} from "~/ingest/types";
import { debug, error } from "~/lib/log.server";
import type { Timings } from "~/lib/timing.server";
import { time } from "~/lib/timing.server";
import { isPresent } from "~/typeGuards";
import { typedKeys } from "~/utils";
import { getCombatantInfoEvents, getFights, getTable } from "~/wcl/queries";
import {
  type CombatantInfoEvents,
  combatantInfoEventsSchema,
  type DamageDoneTable,
  damageDoneTableSchema,
} from "~/wcl/schema";

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
  fightID: number,
  tickData: DamageDoneTable,
  procData: DamageDoneTable,
): SigilOfFlameProcs[] => {
  const tickDataByName = tickData.entries.reduce(
    (acc, val) => ({ ...acc, [val.name]: [val.id, val.tickCount] as const }),
    {} as Record<string, readonly [number, number]>,
  );
  const procDataByName = procData.entries.reduce(
    (acc, val) => ({ ...acc, [val.name]: [val.id, val.hitCount] as const }),
    {} as Record<string, readonly [number, number]>,
  );

  debug(`calculateSigilOfFlameProcs(${fightID}) - tickDataByName`, tickDataByName);
  debug(`calculateSigilOfFlameProcs(${fightID}) - procDataByName`, procDataByName);

  return (
    typedKeys(procDataByName)
      .map<SigilOfFlameProcs>((name) => ({
        sourceID: tickDataByName[name]?.[0] ?? 0,
        name: name,
        ticks: tickDataByName[name]?.[1] ?? 0,
        procs: procDataByName[name]?.[1] ?? 0,
      }))
      // ensure we only keep data where they both ticked and proc-ed
      .filter((it) => it.procs > 0 && it.ticks > 0 && it.name)
  );
};

const getTableData = async (
  reportID: string,
  fightID: number,
  spellID: number,
  timings: Timings,
): Promise<DamageDoneTable | null> => {
  const query = await time(
    () =>
      getTable({
        reportID,
        fightIDs: [fightID],
        spellID,
      }),
    { type: `wcl.query.getTable(${spellID})`, timings },
  );
  const table = query.reportData?.report?.table?.data;
  if (!table) {
    error(
      `Unable to retrieve table for reportID=${reportID} fightID=${fightID} spellID=${spellID}`,
    );
    return null;
  }
  const parsed = await time(() => damageDoneTableSchema.safeParseAsync(table), {
    type: `zod.safeParseAsync.damageDoneTableSchema.${spellID}`,
    timings,
  });
  if (!parsed.success) {
    error("Unable to parse table data", parsed.error.flatten());
    return null;
  }
  return parsed.data;
};

const getCombatantInfos = async (
  reportID: string,
  fightIDs: number[],
  timings: Timings,
): Promise<CombatantInfoEvents> => {
  try {
    const fightIDsAsString = fightIDs.join(",");
    const query = await time(
      () => getCombatantInfoEvents({ reportID, fightIDs }),
      { type: `wcl.query.getCombatantInfoEvents([${fightIDsAsString}])` },
    );
    const events = query.reportData?.report?.events?.data;
    if (!events) {
      error(
        `Unable to retrieve combatant info events for reportID=${reportID} fightIDs=[${fightIDsAsString}]`,
      );
      return [];
    }
    const parsed = await time(
      () => combatantInfoEventsSchema.safeParseAsync(events),
      {
        type: `zod.safeParseAsync.combatantInfoEventsSchema`,
        timings,
      },
    );
    if (!parsed.success) {
      error(
        "Unable to parse combatantinfo events data",
        parsed.error.flatten(),
      );
      return [];
    }
    return parsed.data;
  } catch (e) {
    error("Error while getting combatant infos", e);
    return [];
  }
};

const enhanceReport = async (
  basicReport: Report,
  timings: Timings,
): Promise<ReportWithIngestibleFights | null> => {
  const fightIDs = basicReport.reportFights.map((fight) => fight.id);
  const combatantInfoEvents = await getCombatantInfos(
    basicReport.id,
    fightIDs,
    timings,
  );
  const ingestibleFights = basicReport.reportFights.map<IngestibleReportFight>(
    (fight) => ({
      ...fight,
      combatantInfoEvents: combatantInfoEvents.filter(
        (info) => info.fight === fight.id,
      ),
    }),
  );
  return { ...basicReport, combatantInfoEvents, ingestibleFights };
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
    () => calculateSigilOfFlameProcs(reportFight.id, tickData, procData),
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

  const enhancedReport = await enhanceReport(basicReport, timings);
  if (!enhancedReport) {
    return null;
  }

  const ingestedFights = await ingestFights(
    enhancedReport.ingestibleFights,
    timings,
  );

  return { ...enhancedReport, ingestedFights };
};
