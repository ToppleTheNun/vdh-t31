import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { type ComponentPropsWithoutRef, useEffect, useState } from "react";

import { Button } from "~/components/ui/button";

interface Props
  extends Omit<ComponentPropsWithoutRef<typeof Button>, "onClick"> {
  loading?: boolean;
  value: string;
}
export const CopyButton = ({ loading, value, ...props }: Props) => {
  const [hasCopied, setHasCopied] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  if (loading) {
    return (
      <Button {...props} disabled>
        <Loader2Icon className="mr-2 h-3 w-3" /> Loading...
      </Button>
    );
  }

  if (hasCopied) {
    return (
      <Button {...props} onClick={onClick}>
        <CheckIcon className="mr-2 h-3 w-3" /> Copied
      </Button>
    );
  }

  return (
    <Button {...props} onClick={onClick}>
      <CopyIcon className="mr-2 h-3 w-3" /> Copy
    </Button>
  );
};
