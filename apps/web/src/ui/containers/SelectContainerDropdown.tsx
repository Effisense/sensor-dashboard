import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@/ui/DropdownMenu";
import { Label } from "@radix-ui/react-label";
import { ChevronDown, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../Button";
import { DropdownMenuHeading } from "../DropdownMenu";
import { Container } from "@acme/db";
import Link from "next/link";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const selectedContainer = data?.find(
    (container) => container.id === containerId,
  );

  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-2">
      <Label htmlFor={containerId}>Container</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default">
            <div className="flex items-center justify-center">
              <span>{selectedContainer?.name || "Select container"}</span>
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
                query: {
                  // Using `router.asPath` includes both the base and the query string of the current page
                  redirect: router.asPath,
                },
              }}
            >
              <div className="flex items-start justify-center">
                <Plus className="mr-2 w-4" />
                <span>Add new container</span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectContainerDropdown;
