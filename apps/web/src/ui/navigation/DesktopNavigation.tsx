import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/ui/NavigationMenu";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../Button";
import OrganizationSwitcher from "../OrganizationSwitcher";
import Link from "next/link";
import LoadingSpinner from "../LoadingSpinner";
import LogoLink from "../LogoLink";

const DesktopNavigation = () => {
  const { isSignedIn, isLoaded } = useAuth();
  return (
    <NavigationMenu className="hidden md:flex">
      <div className="flex items-center justify-start">
        <LogoLink />
      </div>

      {isSignedIn && (
        <NavigationMenuList className="gap-x-2">
          {/* Right part of navigation, with the rest */}
          <NavigationMenuItem>
            <Link href="/containers/create">
              <Button variant="link">Add container</Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/sensors/create">
              <Button variant="link">Add sensor</Button>
            </Link>
          </NavigationMenuItem>
          <div className="flex items-center justify-center">
            {!isLoaded && (
              <NavigationMenuItem>
                <LoadingSpinner />
              </NavigationMenuItem>
            )}
            {isSignedIn && (
              <div className="flex items-center justify-center">
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
              </div>
            )}
          </div>
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
};
export default DesktopNavigation;
