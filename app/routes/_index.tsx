import { IngestForm } from "~/components/IngestForm";
import { IndexPageHeader } from "~/components/PageHeader";
import { PageLayout } from "~/components/PageLayout";

const IndexRoute = () => (
  <PageLayout>
    <IndexPageHeader />
    <div className="pb-12 pt-8">
      <IngestForm />
    </div>
  </PageLayout>
);

export { action } from "~/ingest/action.server";
export default IndexRoute;
