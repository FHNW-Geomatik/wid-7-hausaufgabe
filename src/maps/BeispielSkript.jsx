import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import { nanoid } from "nanoid";

const BASE_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary";

function App() {
  const [geoJsonKey, setGeoJsonKey] = useState(null);
  const [quakesGeoJson, setQuakesGeoJson] = useState([]);
  const [mag, setMag] = useState("2.5");
  const [timePeriod, setTimePeriod] = useState("day");

  // "State" der berechnet werden kann, braucht keine separate State-Variable
  // `url` hier ist ein solche "berechnete" State
  const url = `${BASE_URL}/${mag}_${timePeriod}.geojson`;

  async function fetchQuakeData() {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Error fetching data from ${url}`);
      }
      const data = await resp.json();
      setQuakesGeoJson(data.features);
      setGeoJsonKey(nanoid(6)); // generiert einen random String mit Länge 6
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchQuakeData(url);
  }, []);

  return (
    <>
      {/* UIs für `mag` und `timePeriod` State-Variablen   */}

      <MapContainer style={{ height: "100vh" }} center={[0, 0]} zoom={3} minZoom={2}>
        <LayersControl position="topright">
          {/* Base Layers  */}
          <LayersControl.BaseLayer checked name="Esri World Imagery">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Esri World Terrain">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {/* Overlays  */}
          <LayersControl.Overlay checked name="USGQ Earthquakes">
            <GeoJSON data={quakesGeoJson} key={geoJsonKey} />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
}

export default App;
