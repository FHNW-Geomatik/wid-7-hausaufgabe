import { renderToString } from "react-dom/server";
import { Button, CssBaseline, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, LayersControl, Circle } from "react-leaflet";

const outerBounds = [
  [-80, -180],
  [80, 180],
];

const BASE_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";

function getMarkerRadius(magnitude) {
  const baseArea = 10;
  const scaleFactor = 2.5;
  const area = baseArea * Math.pow(10, (magnitude - 1) / scaleFactor);

  return Math.sqrt(area / Math.PI);
}

const pointToLayer = ({ properties }, latlng) => {
  const radius = getMarkerRadius(properties.mag);
  return L.circleMarker(latlng, { radius: radius });
};

const onEachFeature = (feature, layer) => {
  if (feature.properties && feature.properties.place) {
    const popup = <Popup {...feature} />;

    layer.bindPopup(renderToString(popup));
  }
};

function Popup({ properties, geometry }) {
  const [lon, lat, depth] = geometry.coordinates;

  return (
    <>
      <Typography variant="h2">{properties.place}</Typography>
      <p>
        <span style={{ fontWeight: "bold" }}>MAGNITUDE</span>: {properties.mag}
        <br />
        <span style={{ fontWeight: "bold" }}>DEPTH</span>: {depth} km
        <br />
        <span style={{ fontWeight: "bold" }}>TYPE</span>: {properties.type}
        <br />
        <span style={{ fontWeight: "bold" }}>Lon/Lat</span>: {lon}, {lat}
      </p>
      <Typography variant="h3">
        <Link variant="h3" target="_blank" href={properties.url}>
          More info
        </Link>
      </Typography>
    </>
  );
}

function Map() {
  const [quakesJson, setQuakesJson] = useState([]);
  const [minMag, setMinMag] = useState("2.5");
  const [timespan, setTimespan] = useState("week");

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
            <GeoJSON
              data={quakesJson}
              pointToLayer={pointToLayer}
              key={quakesJson.length}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
}

export default Map;
