import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { IngestForm } from "~/components/IngestForm";
import { ReportPageHeader } from "~/components/PageHeader";
import { PageLayout } from "~/components/PageLayout";
import { ReportData, ReportDataFallback } from "~/components/ReportData";
import { H2, Lead } from "~/components/typography";
import { action } from "~/ingest/action.server";
import { loader } from "~/ingest/loader.server";

const ReportRoute = () => {
  const { ingested, reportCode } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <ReportPageHeader />
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
            <H2>Want to ingest another one?</H2>
            <Lead>More data is always good.</Lead>
          </div>
          <IngestForm />
        </div>
      </div>
    </PageLayout>
  );
};

export { action, loader };
export default ReportRoute;
