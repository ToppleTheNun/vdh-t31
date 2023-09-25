import { NavLink } from "@remix-run/react";

export const MainNav = () => (
  <div className="mr-4 hidden md:flex">
    <NavLink to="/" className="mr-6 flex items-center space-x-2">
      <img
        src="/logo.webp"
        alt="Logo"
        height="128"
        width="128"
        className="h-12 w-12"
      />

      <span className="hidden font-bold sm:inline-block">
        VDH T31 Proc Rates
      </span>
    </NavLink>
  </div>
);
