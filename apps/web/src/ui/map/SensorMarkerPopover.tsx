import { PopoverProps } from "@radix-ui/react-popover";
import P from "../typography/P";
import Subtle from "../typography/Subtle";
import { Popover } from "../Popover";
import Link from "next/link";
import { Button } from "../Button";
import percentToColorTremor from "@/utils/percentToColor";
import { Badge } from "../badge";
import formatFillLevel from "@/utils/formatFillLevel";

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
  return (
    <div className="w-64 rounded-lg">
      <Popover {...props}>
        <Badge
          variant="secondary"
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
