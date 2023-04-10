import { PopoverProps } from "@radix-ui/react-popover";
import P from "../typography/P";
import Subtle from "../typography/Subtle";
import { Popover } from "../Popover";
import Link from "next/link";
import { Button } from "../Button";

type SensorMarkerPopoverProps = PopoverProps & {
  title: string;
  content: string;
  link: string;
  linkLabel: string;
};

const SensorMarkerPopover = ({
  title,
  content,
  link,
  linkLabel,
  ...props
}: SensorMarkerPopoverProps) => {
  return (
    <Popover {...props}>
      <P className="font-bold">{title}</P>
      <Subtle>{content}</Subtle>
      <Link href={link}>
        <Button size="sm" variant="subtle">
          {linkLabel}
        </Button>
      </Link>
    </Popover>
  );
};

export default SensorMarkerPopover;
