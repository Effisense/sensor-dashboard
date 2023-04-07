import { Popover, PopoverProps } from "@radix-ui/react-popover";
import P from "../typography/P";
import Subtle from "../typography/Subtle";

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
