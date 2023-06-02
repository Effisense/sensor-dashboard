import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import RotateSpinner from "../RotateSpinner";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <RotateSpinner loading={loading} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AppProvider;
