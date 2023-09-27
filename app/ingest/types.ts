import type { CombatantInfoEvents } from "~/wcl/schema";

export type ReportFight = {
  id: number;
  reportID: string;
  startTime: number;
  endTime: number;
};

export type IngestibleReportFight = ReportFight & {
  combatantInfoEvents: CombatantInfoEvents;
};

export type SigilOfFlameProcs = {
  name: string;
  sourceID: number;
  ticks: number;
  procs: number;
};

export type IngestedReportFight = IngestibleReportFight & {
  procs: SigilOfFlameProcs[];
};

export type Report = {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  reportFights: ReportFight[];
};

export type ReportWithIngestibleFights = Report & {
  combatantInfoEvents: CombatantInfoEvents;
  ingestibleFights: IngestibleReportFight[];
};

export type ReportWithIngestedFights = ReportWithIngestibleFights & {
  ingestedFights: IngestedReportFight[];
};
