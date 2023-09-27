import { type ActionFunctionArgs, redirect } from "@remix-run/node";

import { info } from "~/lib/log.server";
import { getReportCode } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const warcraftLogsCode = body.get("warcraftLogsCode");
  const reportCode = getReportCode(
    typeof warcraftLogsCode === "string" ? warcraftLogsCode : "",
  );
  if (warcraftLogsCode && typeof warcraftLogsCode === "string" && reportCode) {
    info(`Redirecting to /report/${reportCode}`);
    return redirect(`/report/${reportCode}`);
  }
  info(`Redirecting to /`);
  return redirect(`/`);
};
