import Head from "next/head";
import { ReactNode } from "react";
import Footer from "./Footer";
import Navigation from "./navigation/Navigation";
import { useAuth } from "@clerk/nextjs";
import Script from "next/script";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { isSignedIn } = useAuth();
  return (
    <>
      <Head>
        <title>Effisense | Sensor Dashboard</title>
        <meta
          name="description"
          content={`
          Effisense is a platform for monitoring and managing your waste management system.
          Effisense contributes to empowering a cleaner world, one bin at a time.
          Effisense uses an Optical Distance Sensor, a small sensor that can be easily installed in a trash bin or a big container which constantly reads the fill level of the the asset and sends the results to the cloud.
          The sensor inside the trash bin delivers information about fill levels to the cloud. This allows you to monitor the status of your trash bins. Based on the fill levels, you can further plan the emptying schedule.
          `
            .trim()
            // Replace all whitespace characters with a single space.
            .replace(/\s+/g, " ")}
        />
        <meta
          name="keywords"
          content={`
          waste management, trash bin, trash bin monitoring, trash bin management, trash bin sensor, trash bin monitor,
          effisense, sensor, sensor dashboard, sensor monitoring, sensor management, sensor platform, sensor cloud,
          container, container monitoring, container management, container sensor, container monitor,
          bin, bin monitoring, bin management, bin sensor, bin monitor,
          fill level, fill level monitoring, fill level management, fill level sensor, fill level monitor,
          cloud, cloud monitoring, cloud management, cloud sensor, cloud monitor,
          `
            .trim()
            // Replace all whitespace characters with a single space.
            .replace(/\s+/g, " ")}
        />

        <link rel="icon" href="/favicon.svg" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>
      <div className="overflow-x-hidden">
        <div className="flex min-h-screen w-screen flex-col items-center">
          {isSignedIn ? <Navigation /> : <div className="h-20 w-full" />}

          <main className="flex h-full w-screen flex-col items-center">
            {children}
          </main>
        </div>
        <Footer />

        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        />
      </div>
    </>
  );
};

export default Layout;
