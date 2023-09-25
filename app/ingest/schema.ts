import { z } from "zod";

import { getReportCode } from "~/utils";

export const schema = z.object({
  warcraftLogsCode: z
    .string()
    .url()
    .startsWith("https://www.warcraftlogs.com/reports/")
    .refine(
      (link) => getReportCode(link),
      (link) => ({ message: `${link} does not have a valid report code` }),
    )
    .transform((link) => getReportCode(link)),
});

export type Ingest = z.infer<typeof schema>;
