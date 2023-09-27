import { NavLink } from "@remix-run/react";

export const IndexPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        VDH T31 Proc Calculator
      </h1>
    </NavLink>
    <p className="text-lg text-muted-foreground">
      Useful for calculating the proc rates for the VDH T31 4pc.
    </p>
  </div>
);

export const ReportPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        VDH T31 Proc Calculator
      </h1>
    </NavLink>
    <p className="text-lg text-muted-foreground">
      Used for calculating the proc rates for the VDH T31 4pc in your log.
    </p>
  </div>
);

export const ErrorPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        VDH T31 Proc Calculator
      </h1>
    </NavLink>
    <p className="text-lg text-muted-foreground">
      Usually useful, but errored.
    </p>
  </div>
);
