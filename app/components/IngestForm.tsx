import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type Ingest, schema } from "~/ingest/schema";

export const IngestForm = () => {
  const fetcher = useFetcher();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      warcraftLogsCode: "",
    },
  });

  const onSubmit = (values: Ingest) => {
    fetcher.submit(values, { method: "POST" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="warcraftLogsCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WarcraftLogs Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.warcraftlogs.com/reports/..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the link to a WarcraftLogs report you want to load.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
