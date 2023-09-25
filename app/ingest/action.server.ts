import { type ActionFunctionArgs, redirect } from "@remix-run/node";

import { info } from "~/lib/log.server";
import { getReportCode } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const warcraftLogsCode = body.get("warcraftLogsCode");
  if (
    warcraftLogsCode &&
    typeof warcraftLogsCode === "string" &&
    getReportCode(warcraftLogsCode)
  ) {
    info(`Redirecting to /report/${warcraftLogsCode}`);
    return redirect(`/report/${warcraftLogsCode}`);
  }
  info(`Redirecting to /`);
  return redirect(`/`);
};
