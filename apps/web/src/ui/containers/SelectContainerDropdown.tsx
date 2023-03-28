import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@/ui/DropdownMenu";
import { Label } from "@radix-ui/react-label";
import { ChevronDown, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../Button";
import { DropdownMenuHeading } from "../DropdownMenu";
import { Container } from "@acme/db";
import Link from "next/link";
import LoadingSpinner from "../LoadingSpinner";

type SelectContainerDropdownProps = {
  containerId?: string;
  setContainerId: Dispatch<SetStateAction<string | undefined>>;
  isLoading: boolean;
  data?: Container[];
};

const SelectContainerDropdown = ({
  containerId,
  setContainerId,
  data,
  isLoading,
}: SelectContainerDropdownProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-2">
      <Label htmlFor={containerId}>Container</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default">
            <div className="flex items-center justify-center">
              <span>Select container</span>
              <ChevronDown className="ml-2 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuHeading>Select container</DropdownMenuHeading>
          <DropdownMenuSeparator />

          {isLoading && (
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner />
              <DropdownMenuSeparator />
            </div>
          )}

          {data && data.length > 0 && (
            <>
              <DropdownMenuRadioGroup
                value={containerId}
                onValueChange={setContainerId}
              >
                {data?.map((container) => (
                  <DropdownMenuRadioItem
                    value={container.id}
                    key={container.id}
                  >
                    {container.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem>
            <Link
              href={{
                pathname: "/containers/create",
                // TODO: Add query params to redirect back to this page and include the deviceId and collectionId, just like in /scan
              }}
            >
              Add new container
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectContainerDropdown;
