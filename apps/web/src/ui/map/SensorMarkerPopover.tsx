import { PopoverProps } from "@radix-ui/react-popover";
import P from "../typography/P";
import Subtle from "../typography/Subtle";
import { Popover } from "../Popover";
import Link from "next/link";
import { Button } from "../Button";
import percentToColorTremor from "@/utils/percentToSeverity";
import { Badge } from "../badge";
import formatFillLevel from "@/utils/formatFillLevel";
import { cn } from "@/utils/tailwind";

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
          variant="secondary"
          className={cn(
            "py-1 px-2",
            `bg-${percentToColorTremor(fillLevel)}-100`,
            "border-[1px] border-slate-300",
          )}
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
