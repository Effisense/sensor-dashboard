import "../styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import { Toaster } from "@/ui/Toaster";
import { emerald, yellow, red, slate } from "tailwindcss/colors";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider
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
      }}
    >
      <Layout>
        <Component {...pageProps} />
        {/* Load `Toaster` at top-level, and render it using `useToast` */}
        <Toaster />
      </Layout>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
