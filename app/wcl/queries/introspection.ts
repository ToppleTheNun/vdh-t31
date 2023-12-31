import { writeFileSync } from "fs";
import type { IntrospectionQuery } from "graphql";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { resolve } from "path";

import { info } from "~/lib/log.server";

import { getGqlClient } from "../client";

async function loadSchema() {
  const client = await getGqlClient();

  const response = await client.request<IntrospectionQuery>(
    getIntrospectionQuery(),
  );

  const schema = printSchema(buildClientSchema(response));

  const targetPath = resolve("app/wcl/gql/schema.graphql");
  writeFileSync(targetPath, schema);

  info("gql schema loaded");
  process.exit(0);
}

loadSchema()
  // eslint-disable-next-line no-console
  .catch(console.error);
