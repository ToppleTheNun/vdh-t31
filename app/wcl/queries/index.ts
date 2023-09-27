import { getCachedSdk } from "~/wcl/client";
import type {
  GetCombatantInfoEventsQuery,
  GetCombatantInfoEventsQueryVariables,
  GetFightsQuery,
  GetFightsQueryVariables,
  GetTableQuery,
  GetTableQueryVariables,
} from "~/wcl/types";

export const getFights = async (
  params: GetFightsQueryVariables,
): Promise<GetFightsQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getFights(params);
};

export const getTable = async (
  params: GetTableQueryVariables,
): Promise<GetTableQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getTable(params);
};

export const getCombatantInfoEvents = async (
  params: GetCombatantInfoEventsQueryVariables,
): Promise<GetCombatantInfoEventsQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getCombatantInfoEvents(params);
};
