import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Paper, Typography, useTheme } from "@mui/material";

export default function WeatherChart({ data, title, type = "temperature" }) {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 3, height: 350, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <YAxis
              hide
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 12,
                border: "none",
                boxShadow: theme.shadows[4],
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
