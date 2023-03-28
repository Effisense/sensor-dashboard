import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/ui/NavigationMenu";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./Button";
import OrganizationSwitcher from "./OrganizationSwitcher";
import Link from "next/link";
import Logo from "./Logo";

const Navigation = () => {
  return (
    <NavigationMenu>
      {/* Left part of navigation, with logo */}
      <div className="flex items-center justify-start">
        <Link href="/">
          <div className="h-10">
            <Logo />
          </div>
        </Link>
      </div>

      <NavigationMenuList className="gap-x-4">
        {/* Right part of navigation, with the rest */}
        <NavigationMenuItem>
          <Button variant="subtle">My containers</Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/sensors/create">
            <Button variant="subtle">Add sensor</Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <OrganizationSwitcher />
        </NavigationMenuItem>
        <NavigationMenuItem className="mr-6">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "2.5rem",
                  height: "2.5rem",
                },
              },
            }}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default Navigation;
