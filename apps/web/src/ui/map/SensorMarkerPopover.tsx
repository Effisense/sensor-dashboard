import { PopoverProps } from "@radix-ui/react-popover";
import P from "../typography/P";
import Subtle from "../typography/Subtle";
import { Popover } from "../Popover";
import Link from "next/link";

type SensorMarkerPopoverProps = PopoverProps & {
  title: string;
  content: string;
  link: string;
  linkContent: string;
};

const SensorMarkerPopover = ({
  title,
  content,
  link,
  linkContent,
  ...props
}: SensorMarkerPopoverProps) => {
  return (
    <Popover {...props}>
      <P className="font-bold">{title}</P>
      <Subtle>{content}</Subtle>
      <Link href={link}>
        <Subtle className="hover:underline">{linkContent}</Subtle>
        </Link>
    </Popover>
  );
};

export default SensorMarkerPopover;
