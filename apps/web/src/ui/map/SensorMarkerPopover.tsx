import { PopoverProps } from "@radix-ui/react-popover";
import P from "../typography/P";
import Subtle from "../typography/Subtle";
import { Popover } from "../Popover";
import Link from "next/link";
import { Button } from "../Button";
import percentToColorTremor from "@/utils/percentToSeverity";
import formatFillLevel from "@/utils/formatFillLevel";
import { cn } from "@/utils/tailwind";
import { Badge } from "@tremor/react";

type SensorMarkerPopoverProps = PopoverProps & {
  title: string;
  content: string;
  link: string;
  linkLabel: string;
  fillLevel: number | null;
};

const SensorMarkerPopover = ({
  title,
  content,
  link,
  linkLabel,
  fillLevel,
  ...props
}: SensorMarkerPopoverProps) => {
  console.log(fillLevel);
  return (
    <div className="w-64 rounded-lg">
      <Popover {...props}>
        <Badge
          size="sm"
          color={percentToColorTremor(fillLevel)}
          className="py-1 px-2"
        >
          {formatFillLevel(fillLevel)}
        </Badge>
        <P className="text-md font-bold">{title}</P>
        <Subtle>{content}</Subtle>
        <Link href={link}>
          <Button size="sm" variant="subtle" className="mt-2">
            {linkLabel}
          </Button>
        </Link>
      </Popover>
    </div>
  );
};

export default SensorMarkerPopover;
