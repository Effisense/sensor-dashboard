import "../styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import { Toaster } from "@/ui/Toaster";
import ClerkProvider from "@/ui/providers/ClerkProvider";
import AppProvider from "@/ui/providers/AppProvider";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider pageProps={pageProps}>
      <AppProvider>
        <Layout>
          <Component {...pageProps} />
          {/* Load `Toaster` at top-level, and render it using `useToast` */}
          <Toaster />
        </Layout>
      </AppProvider>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
