import useErrorToast from "@/hooks/toast/useErrorToast";
import useMap from "@/hooks/useMap";
import LoadingSpinner from "./LoadingSpinner";
import Subtle from "./typography/Subtle";

const AllSenorsMap = () => {
  const { container, data, isLoading, error } = useMap();

  useErrorToast({ error });

  return (
    <div>
      <div className="h-72 w-72" id="map">
        <div ref={container} className="w-full" />
      </div>
      <div className="py-8">
        {isLoading && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && !error && !!data && (
          <div className="flex items-center justify-center">
            <Subtle>{data}</Subtle>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSenorsMap;
