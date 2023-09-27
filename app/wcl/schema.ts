import { z } from "zod";

export const damageDoneTableEntrySchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: z.string(),
  icon: z.string(),
  itemLevel: z.number(),
  total: z.number(),
  activeTime: z.number(),
  activeTimeReduced: z.number(),
  damageAbilities: z.array(z.unknown()),
  targets: z.array(
    z.object({ name: z.string(), total: z.number(), type: z.string() }),
  ),
  talents: z.array(z.unknown()),
  gear: z.array(z.unknown()),
  uptime: z.number().optional(),
  uses: z.number(),
  hitCount: z.number(),
  tickCount: z.number(),
  tickMissCount: z.number(),
  missCount: z.number(),
  multistrikeHitCount: z.number(),
  multistrikeTickCount: z.number(),
  multistrikeMissCount: z.number(),
  multistrikeTickMissCount: z.number(),
  critHitCount: z.number(),
  critTickCount: z.number(),
  hitdetails: z.array(
    z.object({
      type: z.string(),
      total: z.number(),
      count: z.number(),
      absorbOrOverheal: z.number(),
      min: z.number(),
      max: z.number(),
    }),
  ),
  multistrikedetails: z.array(z.unknown()),
  missdetails: z.array(z.unknown()),
  multistrikemissdetails: z.array(z.unknown()),
});
export type DamageDoneTableEntry = z.infer<typeof damageDoneTableEntrySchema>;

export const damageDoneTableSchema = z.object({
  entries: z.array(damageDoneTableEntrySchema),
  totalTime: z.number().int(),
  logVersion: z.number().int(),
  gameVersion: z.number().int(),
});
export type DamageDoneTable = z.infer<typeof damageDoneTableSchema>;

export const talentTreeEntrySchema = z.object({
  id: z.number().int(),
  rank: z.number().int(),
  spellID: z.number().int(),
  icon: z.string(),
  nodeID: z.number().int(),
  spellType: z.number().int(),
});
export type TalentTreeEntry = z.infer<typeof talentTreeEntrySchema>;

export const talentTreeSchema = z.array(talentTreeEntrySchema);
export type TalentTree = z.infer<typeof talentTreeSchema>;

export const combatantInfoEventSchema = z.object({
  type: z.literal("combatantinfo"),
  fight: z.number().int(),
  sourceID: z.number().int(),
  talentTree: talentTreeSchema,
});
export type CombatantInfoEvent = z.infer<typeof combatantInfoEventSchema>;

export const combatantInfoEventsSchema = z.array(combatantInfoEventSchema);
export type CombatantInfoEvents = z.infer<typeof combatantInfoEventsSchema>;
