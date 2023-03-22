import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/ui/NavigationMenu";
import { useState } from 'react';
import { UserButton } from "@clerk/nextjs";
import { Button } from "./Button";
import OrganizationSwitcher from "./OrganizationSwitcher";
import Link from 'next/link';

const Navigation = () => {
  // TODO: Add Navigation

  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(prevShowProfile => !prevShowProfile);
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
      <NavigationMenuItem>
      <Link href="/">
        <div className="mr-64 font-bold text-[25px]">
        Effisense Dashboard
          </div>
        </Link>
        </NavigationMenuItem>
      <NavigationMenuItem>
        <div className="mx-7">
        <Button variant="default">My containers</Button>
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
        <div className="mx-7">
        <Link href="/sensors/create">
        <Button variant="default">Add sensor</Button>
        </Link>
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
        <div className="mx-7">
          <OrganizationSwitcher/>
          </div>
        </NavigationMenuItem>
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default Navigation;
