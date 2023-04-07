import { PopoverProps } from "@radix-ui/react-popover";
import P from "../typography/P";
import Subtle from "../typography/Subtle";
import { Popover } from "../Popover";

type SensorMarkerPopoverProps = PopoverProps & {
  title: string;
  content: string;
};

const SensorMarkerPopover = ({
  title,
  content,
  ...props
}: SensorMarkerPopoverProps) => {
  return (
    <Popover {...props}>
      <P className="font-bold">{title}</P>
      <Subtle>{content}</Subtle>
    </Popover>
  );
};

export default SensorMarkerPopover;
