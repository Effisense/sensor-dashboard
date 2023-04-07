import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverProps,
} from "@radix-ui/react-popover";

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
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
};

export default SensorMarkerPopover;
