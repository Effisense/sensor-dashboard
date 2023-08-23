import { PopoverProps } from "@radix-ui/react-popover";
import Subtle from "../typography/Subtle";
import { Popover } from "../Popover";
import Link from "next/link";
import { Button } from "../Button";
import percentToColorTremor from "@/utils/percentToSeverity";
import formatFillLevel from "@/utils/formatFillLevel";
import { Badge } from "@tremor/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import H2 from "../typography/H2";
import H4 from "../typography/H4";
import { Separator } from "../Separator";

type SensorMarkerPopoverProps = PopoverProps & {
  title: string;
  content: string;
  link: string;
  linkLabel: string;
  fillLevel: number | null;
  lastSeen: Date | null;
};

const SensorMarkerPopover = ({
  title,
  content,
  link,
  linkLabel,
  fillLevel,
  lastSeen,
  ...props
}: SensorMarkerPopoverProps) => {
  return (
    <div className="w-64 rounded-lg">
      <Popover {...props}>
        <div className="flex items-center justify-start gap-x-4">
          <H2 className="text-md font-bold">{title}</H2>
          <Badge
            size="sm"
            color={percentToColorTremor(fillLevel)}
            className="h-8 py-1 px-2"
          >
            {formatFillLevel(fillLevel)}
          </Badge>
        </div>

        <Separator />

        {lastSeen && (
          <div className="flex flex-row gap-x-2">
            <ClockIcon className="w-4" />
            <Subtle>
              Last seen{" "}
              {lastSeen.toLocaleDateString("no-NB", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Subtle>
          </div>
        )}
        {content && content.length > 0 && (
          <div>
            <H4 className="mt-2">Description</H4>
            <Subtle>{content}</Subtle>
          </div>
        )}

        <Separator />

        <Link href={link} className="flex justify-end">
          <Button size="sm" variant="subtle" className="mt-2">
            {linkLabel}
          </Button>
        </Link>
      </Popover>
    </div>
  );
};

export default SensorMarkerPopover;
