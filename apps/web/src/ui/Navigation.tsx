import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/ui/NavigationMenu";
import { UserButton } from "@clerk/nextjs";
import OrganizationSwitcher from "./OrganizationSwitcher";

const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="mr-8 flex items-center justify-center gap-8">
        <NavigationMenuItem>
          <OrganizationSwitcher />
        </NavigationMenuItem>
        <NavigationMenuItem>
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
