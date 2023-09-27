import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { IngestForm } from "~/components/IngestForm";
import { PageLayout } from "~/components/PageLayout";
import { ReportData, ReportDataFallback } from "~/components/ReportData";
import { action } from "~/ingest/action.server";
import { loader } from "~/ingest/loader.server";

const ReportRoute = () => {
  const { ingested, reportCode } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <Suspense fallback={<ReportDataFallback reportCode={reportCode} />}>
        <Await resolve={ingested}>
          {(resolvedInjested) => (
            <ReportData ingested={resolvedInjested} reportCode={reportCode} />
          )}
        </Await>
      </Suspense>
      <div className="pb-12 pt-8">
        <div className="space-y-3">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Want to ingest another one?
            </h2>
            <p className="text-lg text-muted-foreground">
              More data is always good.
            </p>
          </div>
          <IngestForm />
        </div>
      </div>
    </PageLayout>
  );
};

export { action, loader };
export default ReportRoute;
