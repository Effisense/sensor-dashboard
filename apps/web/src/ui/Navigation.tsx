import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/ui/NavigationMenu";
import { UserButton } from "@clerk/nextjs";

const Navigation = () => {
  // TODO: Add Navigation
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
        <div className="mx-16">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
        <div className="mx-16">
          
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default Navigation;
