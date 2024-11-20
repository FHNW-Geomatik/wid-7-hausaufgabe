import { CssBaseline } from "@mui/material";
import { LatLngBounds } from "leaflet";
import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import { ScaleControl } from "react-leaflet/ScaleControl";
import fhnwImage from "./baslerMuenster.png";

function Map() {
  const bounds = new LatLngBounds(
    [47.555661791938846, 7.591231810607283],
    [47.55745702245849, 7.593894184199307]
  );
  const position = bounds.getCenter();

  return (
    <>
      <CssBaseline />
      <MapContainer style={{ height: "100vh" }} center={position} zoom={23} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>'
          url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
        />

        <ImageOverlay
          // url="http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
          url={fhnwImage}
          bounds={bounds}
          opacity={0.85}
          zIndex={10}
        />
        <ScaleControl />
      </MapContainer>
    </>
  );
}

export default Map;
