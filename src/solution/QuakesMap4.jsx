import { renderToString } from "react-dom/server";
import { CssBaseline, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, LayersControl, Circle } from "react-leaflet";
import Header from "./Header";
import Params from "./Params";
import { BASE_LAYERS } from "./baseLayers";

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
  return L.circleMarker(latlng, { radius: radius, color: "deeppink" });
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
  // const [minMag, setMinMag] = useState("2.5");
  // const [timespan, setTimespan] = useState("week");
  const [geoJsonKey, setgeoJsonKey] = useState(null);
  const [params, setParams] = useState({
    minMag: "2.5",
    timespan: "day",
  });

  // calculated state
  const url = `${BASE_URL}/${params.minMag}_${params.timespan}.geojson`;

  async function fetchQuakeData(url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Error fetching data from ${url}`);
      }
      const data = await resp.json();
      setQuakesJson(data.features);
      setgeoJsonKey(data.metadata.generated);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchQuakeData(url);
  }, []);

  useEffect(() => {
    if (params.timespan === "month") {
      setParams(p => ({ ...p, minMag: "2.5" }));
    }
  }, [params.timespan]);

  useEffect(() => {
    // console.log(params);
    fetchQuakeData(url);
  }, [params.minMag, params.timespan]);

  return (
    <>
      <CssBaseline />
      <Header />
      <Params params={params} setParams={setParams} />
      <MapContainer
        style={{ height: "100vh" }}
        center={[0, 0]}
        zoom={3}
        minZoom={2}
        maxBounds={outerBounds}
        maxBoundsViscosity={1}
      >
        <LayersControl position="topright">
          {BASE_LAYERS.map(baseLayer => (
            <LayersControl.BaseLayer
              key={baseLayer.url}
              checked={baseLayer.checked}
              name={baseLayer.name}
            >
              <TileLayer attribution={baseLayer.attribution} url={baseLayer.url} />
            </LayersControl.BaseLayer>
          ))}

          <LayersControl.Overlay checked name="USGQ Earthquakes">
            <GeoJSON
              data={quakesJson}
              pointToLayer={pointToLayer}
              key={geoJsonKey}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
}

export default Map;
