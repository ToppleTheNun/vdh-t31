import { NavLink } from "@remix-run/react";

import { H1, Lead } from "~/components/typography";

export const IndexPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <H1>VDH T31 Proc Calculator</H1>
    </NavLink>
    <Lead>Useful for calculating the proc rates for the VDH T31 4pc.</Lead>
  </div>
);

export const ReportPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <H1>VDH T31 Proc Calculator</H1>
    </NavLink>
    <Lead>
      Used for calculating the proc rates for the VDH T31 4pc in your log.
    </Lead>
  </div>
);

export const ErrorPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <H1>VDH T31 Proc Calculator</H1>
    </NavLink>
    <Lead>Usually useful, but errored.</Lead>
  </div>
);
