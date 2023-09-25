import { CheckIcon, CopyIcon } from "lucide-react";
import { type HTMLAttributes, useEffect, useState } from "react";

import { Button } from "~/components/ui/button";

interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {
  value: string;
}
export const CopyButton = ({ value, ...props }: Props) => {
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
