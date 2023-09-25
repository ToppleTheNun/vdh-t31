import { useLoaderData } from "@remix-run/react";

import { CopyButton } from "~/components/CopyButton";
import { IngestForm } from "~/components/IngestForm";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { action } from "~/ingest/action.server";
import { loader } from "~/ingest/loader.server";

const ReportRoute = () => {
  const ingested = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <main className="relative py-6 lg:gap-10 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              VDH T31 Procs for {ingested.reportCode}
            </h1>
            <p className="text-muted-foreground text-lg">
              Proc rates for the VDH T31 4pc.
            </p>
          </div>
          <div className="pb-12 pt-8">
            <div className="relative mt-6 grid w-full gap-2" dir="ltr">
              <Label htmlFor="ingested">
                Data (for easy paste into Google Sheets)
              </Label>
              <Textarea
                readOnly
                className="resize-none font-mono"
                id="ingested"
                value={ingested.ingested}
              />
              <CopyButton value={ingested.ingested} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              Want to ingest another one?
            </h1>
            <p className="text-muted-foreground text-lg">
              More data is always good.
            </p>
          </div>
          <div className="pb-12 pt-8">
            <IngestForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export { action, loader };
export default ReportRoute;
