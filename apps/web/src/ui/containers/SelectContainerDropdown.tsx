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
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../Button";
import { DropdownMenuHeading } from "../DropdownMenu";
import Link from "next/link";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter } from "next/router";
import { ContainerSchema } from "@acme/db/src/schema";

type SelectContainerDropdownProps = {
  containerId?: number | null;
  setContainerId: Dispatch<SetStateAction<number | null | undefined>>;
  isLoading: boolean;
  data?: ContainerSchema[];
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
      <Label htmlFor={containerId?.toString() || ""}>Container</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default">
            <div className="flex items-center justify-center">
              <span>{selectedContainer?.name || "Select container"}</span>
              <ChevronDownIcon className="ml-2 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuHeading>Select container</DropdownMenuHeading>
          <DropdownMenuSeparator />

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-2">
              <LoadingSpinner />
              <DropdownMenuSeparator />
            </div>
          )}

          {data && data.length > 0 && (
            <>
              <DropdownMenuRadioGroup
                value={String(containerId) || undefined}
                onValueChange={(value) => setContainerId(Number(value))}
              >
                {data?.map((container) => (
                  <DropdownMenuRadioItem
                    value={String(container.id)}
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
                <PlusIcon className="mr-2 w-4" />
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
