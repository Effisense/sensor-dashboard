import Head from "next/head";
import { ReactNode } from "react";
import Footer from "./Footer";
import Navigation from "./Navigation";
import { useAuth } from "@clerk/nextjs";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {

  const { isSignedIn } = useAuth();

    return (
    <>
      <Head>
        <title>Effisense | Sensor Dashboard</title>
        <meta name="description" content="TODO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {isSignedIn && (
      <Navigation />
      )}

      <main className="flex min-h-screen w-screen flex-col items-center bg-sage-1 text-sage-12">
        {children}
      </main>

      <Footer />

      
    </>
  );
};

export default Layout;
