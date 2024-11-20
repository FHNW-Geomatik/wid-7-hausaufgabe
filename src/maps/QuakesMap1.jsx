import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";

const outerBounds = [
  [-80, -180],
  [80, 180],
];

const BASE_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";

const pointToLayer = ({ properties }, latlng) => {
  return L.marker(latlng);
};

function Map() {
  const [quakesJson, setQuakesJson] = useState([]);
  const [minMag, setMinMag] = useState("2.5");
  const [timespan, setTimespan] = useState("day");

  async function fetchQuakeData(url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Error fetching data from ${url}`);
      }
      const data = await resp.json();
      setQuakesJson(data.features);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const url = `${BASE_URL}/${minMag}_${timespan}.geojson`;
    fetchQuakeData(url);
  }, []);

  console.log(quakesJson);

  return (
    <>
      <CssBaseline />
      <MapContainer
        style={{ height: "100vh" }}
        center={[0, 0]}
        zoom={3}
        minZoom={2}
        maxBounds={outerBounds}
        maxBoundsViscosity={1}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="World Imagery">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="USGQ Earthquakes">
            <GeoJSON data={quakesJson} pointToLayer={pointToLayer} key={quakesJson.length} />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
}

export default Map;
