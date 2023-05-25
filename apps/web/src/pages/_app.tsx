import "../styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Layout from "../ui/Layout";
import { Toaster } from "@/ui/Toaster";
import ClerkProvider from "@/ui/providers/ClerkProvider";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider pageProps={pageProps}>
      <Layout>
        <Component {...pageProps} />
        {/* Load `Toaster` at top-level, and render it using `useToast` */}
        <Toaster />
      </Layout>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
