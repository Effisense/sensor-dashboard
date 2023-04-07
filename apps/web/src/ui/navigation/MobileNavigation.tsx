import { Button } from "../Button";
import { SheetTrigger, SheetContent, Sheet, SheetFooter } from "../Sheet";
import LogoLink from "../LogoLink";
import { UserButton, useAuth } from "@clerk/nextjs";
import OrganizationSwitcher from "../OrganizationSwitcher";
import LoadingSpinner from "../LoadingSpinner";
import navigation from "@/lib/navigation";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon } from "@heroicons/react/24/solid";

const MobileNavigation = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  return (
    <div className="flex h-20 items-center justify-between p-4 md:hidden">
      <div className="flex items-center justify-start">
        <LogoLink />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Bars3Icon className="w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex w-10/12 flex-col items-center justify-center">
          <div className="my-4 flex flex-col items-center gap-y-2">
            {navigation.map((item, i) => {
              const active = router.pathname === item.href;
              return (
                <Link href={item.href} key={i}>
                  <Button variant={active ? "subtle" : "link"}>
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <SheetFooter>
            <div className="flex items-center justify-center">
              {!isLoaded && (
                <div className="flex flex-col items-center justify-center">
                  <LoadingSpinner />
                  <span>Loading organization...</span>
                </div>
              )}
              {isSignedIn && (
                <div className="flex items-center justify-center">
                  <OrganizationSwitcher />
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
                </div>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
