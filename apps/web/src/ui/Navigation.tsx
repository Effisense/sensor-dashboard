import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/ui/NavigationMenu";
import { useState } from 'react';
import { OrganizationProfile, UserButton } from "@clerk/nextjs";
import { Button } from "./Button";

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
      <>
      <Button variant="outline" onClick={toggleProfile}>Manage organization</Button>
      {showProfile && <OrganizationProfile />}
    </>
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
