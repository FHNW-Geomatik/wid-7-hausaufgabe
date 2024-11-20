import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box, Stack, Typography } from "@mui/material";

const TIME_PERIOD_OPTS = [
  { value: "hour", displayName: "Last Hour" },
  { value: "day", displayName: "Last Day" },
  { value: "week", displayName: "Last 7 Days" },
  { value: "month", displayName: "Last 30 Days" },
];

const MAGNITUDE_OPTS = [
  { value: "all", displayName: "All" },
  { value: "1.0", displayName: "M1.0+" },
  { value: "2.5", displayName: "M2.5+" },
  { value: "4.5", displayName: "M4.5+" },
  { value: "significant", displayName: "Significant" },
];

// limit the magnitude options for the longest time period
const MONTH_MAGNITUDE_OPTS = ["2.5", "4.5", "significant"];

export default function Params({ params, setParams }) {
  function handleChange(event, newValue) {
    if (newValue !== null) {
      const attr = event.target.name;
      if (attr === "timespan" && newValue === "month") {
        setParams({ minMag: "2.5", timespan: newValue });
      } else {
        setParams({ ...params, [attr]: newValue });
      }
    }
  }

  // for timespan == 'month' only enable the
  // MONTH_MAGNITUDE_OPTS to prevent loading very large JSON file
  function magOptionDisabled(magValue) {
    if (params.timespan === "month") {
      return !MONTH_MAGNITUDE_OPTS.includes(magValue);
    }

    return false;
  }

  return (
    <Stack direction="row">
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2">Select Magnitude</Typography>
        <ToggleButtonGroup
          value={params.minMag}
          exclusive
          onChange={handleChange}
          aria-label="text alignment"
        >
          {MAGNITUDE_OPTS.map(opt => {
            return (
              <ToggleButton
                key={opt.value}
                value={opt.value}
                name="minMag"
                disabled={magOptionDisabled(opt.value)}
              >
                {opt.displayName}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2">Select Time Period</Typography>
        <ToggleButtonGroup
          value={params.timespan}
          exclusive
          onChange={handleChange}
          aria-label="text alignment"
        >
          {TIME_PERIOD_OPTS.map(opt => {
            return (
              <ToggleButton key={opt.value} value={opt.value} name="timespan">
                {opt.displayName}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
}
