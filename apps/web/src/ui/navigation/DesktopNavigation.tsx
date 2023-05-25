import { Button } from "../Button";
import OrganizationSwitcher from "../OrganizationSwitcher";
import Link from "next/link";
import LoadingSpinner from "../LoadingSpinner";
import LogoLink from "../LogoLink";
import navigation from "@/lib/navigation";
import { useRouter } from "next/router";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../NavigationMenu";

const DesktopNavigation = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  return (
    <NavigationMenu className="hidden md:flex">
      <div className="flex items-center justify-start">
        <LogoLink />
      </div>

      {isSignedIn && (
        <NavigationMenuList className="gap-x-2">
          {/* Right part of navigation, with the rest */}
          {navigation.map((item, i) => {
            const active = router.pathname === item.href;
            return (
              <NavigationMenuItem key={i}>
                <Link href={item.href}>
                  <Button variant={active ? "subtle" : "link"}>
                    {item.label}
                  </Button>
                </Link>
              </NavigationMenuItem>
            );
          })}
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
                    afterSignOutUrl="/"
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
