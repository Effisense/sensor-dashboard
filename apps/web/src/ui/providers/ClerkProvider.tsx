import React, { ReactNode } from "react";
import { ClerkProvider as _ClerkProvider } from "@clerk/nextjs";
import { slate, red, emerald, yellow } from "tailwindcss/colors";

interface ClerkProviderProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps: any;
}

const ClerkProvider: React.FC<ClerkProviderProps> = ({
  children,
  pageProps,
}) => {
  return (
    <_ClerkProvider
      {...pageProps}
      appearance={{
        variables: {
          colorPrimary: slate[500],
          colorBackground: slate[50],
          colorDanger: red[500],
          colorSuccess: emerald[500],
          colorWarning: yellow[500],
          colorText: slate[900],
        },
        signIn: {
          variables: {
            colorPrimary: emerald[600],
          },
        },
        signUp: {
          variables: {
            colorPrimary: emerald[600],
          },
        },
        organizationProfile: {
          variables: {
            colorPrimary: emerald[600],
          },
        },
        userProfile: {
          variables: {
            colorPrimary: emerald[600],
          },
        },
      }}
    >
      {children}
    </_ClerkProvider>
  );
};

export default ClerkProvider;
