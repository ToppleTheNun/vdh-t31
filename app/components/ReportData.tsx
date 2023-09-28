import { CopyButton } from "~/components/CopyButton";
import { H2, Lead } from "~/components/typography";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export const ReportDataFallback = ({ reportCode }: { reportCode: string }) => (
  <div className="pb-12 pt-8">
    <H2>Loading results for {reportCode}...</H2>
    <Lead>
      Don&apos;t worry, the results will be formatted for easy pasting into
      Google Sheets.
    </Lead>
    <div className="relative mt-6 grid w-full gap-2" dir="ltr">
      <Label htmlFor="ingested">Data (for easy paste into Google Sheets)</Label>
      <Textarea
        readOnly
        className="resize-none font-mono"
        id="ingested"
        rows={2}
        value="Loading..."
      />
      <CopyButton loading value="" />
    </div>
  </div>
);

export const ReportData = ({
  ingested,
  reportCode,
}: {
  ingested: string;
  reportCode: string;
}) => {
  const rows = Math.max(1, Math.min(ingested.split("\n").length, 20));

  return (
    <div className="pb-12 pt-8">
      <H2>Results for {reportCode}</H2>
      <Lead>
        The results are formatted for easy pasting into Google Sheets.
      </Lead>
      <div className="relative mt-6 grid w-full gap-2" dir="ltr">
        <Label htmlFor="ingested">Results</Label>
        <Textarea
          readOnly
          className="resize-none font-mono"
          id="ingested"
          rows={rows}
          value={ingested}
        />
        <CopyButton value={ingested} />
      </div>
    </div>
  );
};
