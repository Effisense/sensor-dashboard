# Sensor Dashboard: `leaflet`

TODO: Fill out this if it ends up being used.

## Purpose

This package contains our own abstractions over the [Mapbox GL JS library](https://docs.mapbox.com/mapbox-gl-js/api/), and is used in [`apps/web`](/apps/web). This is done because we know that all maps share some common attributes, and thus we can abstract away the common logic into a single package.

As an example, inspect `MapboxMap` and `MapboxMarker`:

```ts
export const MapboxMap = ({ container, style, center, zoom }: MapOptions) =>
  new mapboxgl.Map({
    container,
    style,
    center,
    zoom: zoom || 13,
  })
    .addControl(new mapboxgl.NavigationControl())
    .addControl(new mapboxgl.FullscreenControl())
    .addControl(new mapboxgl.GeolocateControl())
    .addControl(MapboxGeocoder, "top-left");

export const MapboxMarker = ({
  latitude,
  longitude,
  addTo,
  color,
}: MarkerOptions) =>
  new mapboxgl.Marker({
    color: color || green[500],
  })
    .setLngLat({
      lat: latitude,
      lng: longitude,
    })
    .addTo(addTo);
```

All maps have `NavigationControl`, `FullscreenControl`, etc... This way, there is no need to define this for all maps; we simply import our own `MapboxMap` from our own `mapbox` package.

## Consuming the package

For more information on how the web application ([`apps/web`](/apps/web/)) consumes the `mapbox` package, please inspect the [`web` documentation](/apps/web/).
