import { LatLngExpression, latLngBounds } from "leaflet";

type GetBoundsProps = {
  coordinates: LatLngExpression[];
  fallback: LatLngExpression;
};

const getBounds = ({ coordinates, fallback }: GetBoundsProps) => {
  return coordinates.length > 0
    ? latLngBounds(coordinates)
    : latLngBounds([fallback]);
};

export default getBounds;
