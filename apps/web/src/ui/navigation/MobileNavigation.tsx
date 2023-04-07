import { MenuIcon } from "lucide-react";
import { Button } from "../Button";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "../Sheet";
import LogoLink from "../LogoLink";

const MobileNavigation = () => {
  return (
    <div className="flex h-20 items-center justify-between p-4 md:hidden">
      <div className="flex items-center justify-start">
        <LogoLink />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <MenuIcon className="w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
