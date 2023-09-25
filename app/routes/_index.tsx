import { IngestForm } from "~/components/IngestForm";

const IndexRoute = () => (
  <div className="container">
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            VDH T31 Proc Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            Useful for calculating the proc rates for the VDH T31 4pc.
          </p>
        </div>
        <div className="pb-12 pt-8">
          <IngestForm />
        </div>
      </div>
    </main>
  </div>
);

export { action } from "~/ingest/action.server";
export default IndexRoute;
