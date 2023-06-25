# Sensor Dashboard: `leaflet`

## Purpose

This package contains our own abstractions over the [Leaflet](https://leafletjs.com/) and [React Leaflet](https://react-leaflet.js.org/) libraries, and is used in [`apps/web`](/apps/web). This is done because we know that all maps share some common attributes, and thus we can abstract away the common logic into a single package.

## Consuming the package

For more information on how the web application ([`apps/web`](/apps/web/)) consumes the `mapbox` package, please inspect the [`web` documentation](/apps/web/).
