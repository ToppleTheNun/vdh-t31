import type {
  IngestedReportFight,
  ReportWithIngestedFights,
  SigilOfFlameProcs,
} from "~/ingest/types";
import { isPresent } from "~/typeGuards";
import { formatDuration } from "~/utils";
import type { CombatantInfoEvents } from "~/wcl/schema";

const NEWLINE_CHARACTER = "\n";
const TAB_CHARACTER = "\t";

type SigilModifier = "None" | "Precise" | "Concentrated" | "";

const calculateLineForProcs =
  (
    duration: string,
    wclLink: string,
    combatantInfoEvents: CombatantInfoEvents,
  ) =>
  (proc: SigilOfFlameProcs) => {
    const combatantInfoEvent = combatantInfoEvents.find(
      (event) => event.sourceID === proc.sourceID,
    );
    const hasPreciseSigils =
      combatantInfoEvent?.talentTree?.some((it) => it.id === 112855) ?? false;
    const hasConcentratedSigils =
      combatantInfoEvent?.talentTree?.some((it) => it.id === 112856) ?? false;
    const hasQuickenedSigils =
      combatantInfoEvent?.talentTree?.some((it) => it.id === 112915) ?? false;
    const hasChainsOfAnger =
      combatantInfoEvent?.talentTree?.find((it) => it.id === 112879)?.rank ?? 0;
    const hasIlluminatedSigils =
      combatantInfoEvent?.talentTree?.find((it) => it.id === 117760)?.rank ?? 0;

    let preciseConcentratedNone: SigilModifier = "";
    let quickened = "FALSE";
    let chainsOfAnger = "FALSE";
    let illuminated = "FALSE";
    if (combatantInfoEvent) {
      if (hasPreciseSigils) {
        preciseConcentratedNone = "Precise";
      } else if (hasConcentratedSigils) {
        preciseConcentratedNone = "Concentrated";
      } else {
        preciseConcentratedNone = "None";
      }

      if (hasQuickenedSigils) {
        quickened = "TRUE";
      }

      if (hasChainsOfAnger) {
        chainsOfAnger = "TRUE";
      }

      if (hasIlluminatedSigils) {
        illuminated = "TRUE";
      }
    }

    return [
      proc.name,
      wclLink,
      preciseConcentratedNone,
      quickened,
      chainsOfAnger,
      illuminated,
      duration,
      "", // number of targets,
      `${proc.ticks}`,
      `${proc.procs}`,
    ].join(TAB_CHARACTER);
  };

const formatIngestedReportFightAsTSV = (fight: IngestedReportFight): string => {
  const duration = formatDuration(fight.endTime - fight.startTime);
  const wclLink = `https://www.warcraftlogs.com/reports/${fight.reportID}#fight=${fight.id}`;

  return fight.procs
    .map(calculateLineForProcs(duration, wclLink, fight.combatantInfoEvents))
    .filter(isPresent)
    .filter((it) => it.trim().length !== 0)
    .join(NEWLINE_CHARACTER);
};

export const formatAsTSV = (report: ReportWithIngestedFights): string =>
  report.ingestedFights
    .map(formatIngestedReportFightAsTSV)
    .filter(isPresent)
    .filter((it) => it.trim().length !== 0)
    .join(NEWLINE_CHARACTER);
