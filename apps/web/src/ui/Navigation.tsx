import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/ui/NavigationMenu";
import { useState } from 'react';
import { OrganizationProfile, UserButton } from "@clerk/nextjs";
import { Button } from "./Button";
import OrganizationSwitcher from "./OrganizationSwitcher";

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
        <div className="mx-7">
        <Button variant="default">My containers</Button>
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
        <div className="mx-7">
        <Button variant="default">Add sensor</Button>
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
