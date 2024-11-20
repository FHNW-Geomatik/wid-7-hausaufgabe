import { CssBaseline, Stack, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Map() {
  const position = [47.53482609456414, 7.6419273263886875];

  return (
    <>
      <CssBaseline />
      <MapContainer style={{ height: "100vh" }} center={position} zoom={18} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <Stack direction="row" gap={2}>
              <a
                href="https://unsplash.com/photos/a-large-white-building-with-a-staircase-y3QKr4TARLA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                target="_blank"
              >
                <img src={ImgUrl} width={120} alt="" />
              </a>
              <Stack>
                <Typography variant="subtitle1">A pretty CSS3 popup. </Typography>
                <Typography variant="subtitle2">Easily customizable.</Typography>
              </Stack>
            </Stack>
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}

export default Map;

const ImgUrl =
  "https://images.unsplash.com/photo-1656772133661-644caa299e8c?q=80&w=2908&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
