import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/ui/NavigationMenu";
import { useAuth, UserButton } from "@clerk/nextjs";
<<<<<<< HEAD:apps/web/src/ui/Navigation.tsx
import { Button } from "./Button";
import OrganizationSwitcher from "./OrganizationSwitcher";
import Link from "next/link";
import Logo from "./Logo";
import LoadingSpinner from "./LoadingSpinner";

const Navigation = () => {
  const { isSignedIn, isLoaded } = useAuth();
  return (
    <div className="">
      <NavigationMenu className="hidden md:flex">
        {/* Left part of navigation, with logo */}
        <div className="flex items-center justify-start">
          <Link href="/">
            <div className="h-10 transition-all duration-300 hover:drop-shadow-lg">
              <Logo />
            </div>
          </Link>
        </div>

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
      </NavigationMenu>

      {/* Ny meny inn her */}
      <NavigationMenu className="flex flex-col items-center justify-center md:hidden">
        <div className="flex items-center justify-start">
          <Link href="/">
            <div className="h-10 transition-all duration-300 hover:drop-shadow-lg">
              <Logo />
            </div>
          </Link>
        </div>
      </NavigationMenu>
    </div>
=======
import { Button } from "../Button";
import OrganizationSwitcher from "../OrganizationSwitcher";
import Link from "next/link";
import LoadingSpinner from "../LoadingSpinner";
import LogoLink from "../LogoLink";
import navigation from "@/lib/navigation";
import { useRouter } from "next/router";

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
                  />
                </NavigationMenuItem>
              </div>
            )}
          </div>
        </NavigationMenuList>
      )}
    </NavigationMenu>
>>>>>>> main:apps/web/src/ui/navigation/DesktopNavigation.tsx
  );
};
export default DesktopNavigation;
