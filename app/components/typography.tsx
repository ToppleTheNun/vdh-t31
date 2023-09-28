import type { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {}
export const H1 = ({ className, ...props }: HeadingProps) => (
  <h1
    {...props}
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
  />
);

export const H2 = ({ className, ...props }: HeadingProps) => (
  <h2
    {...props}
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      className,
    )}
  />
);

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Lead = ({ className, ...props }: ParagraphProps) => (
  <p {...props} className={cn("text-xl text-muted-foreground", className)} />
);
