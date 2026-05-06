import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  alpha,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Cloud,
  Droplets,
  LogOut,
  MapPin,
  Menu as MenuIcon,
  Navigation,
  RefreshCw,
  Search as SearchIcon,
  Sun,
  Thermometer,
  User as UserIcon,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  fetchCurrentWeather,
  fetchForecast,
  fetchHistory,
  fetchSuggestions,
} from "./api/weatherApi";
import { getTheme } from "./theme";
import WeatherChart from "./components/WeatherChart";
import AuthPage from "./components/AuthPage";

export default function App() {
  // Auth State
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("weather-user")));
  const [token, setToken] = useState(() => localStorage.getItem("weather-token"));
  
  // Dashboard State
  const [city, setCity] = useState("Chennai");
  const [query, setQuery] = useState("Chennai");
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("dark");
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [current, fc, hist] = await Promise.all([
          fetchCurrentWeather(city, units),
          fetchForecast(city, units),
          fetchHistory(city, units),
        ]);
        if (isMounted) {
          setWeather(current);
          setForecast(fc);
          setHistory(hist);
          setError("");
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [city, units, token]);

  useEffect(() => {
    if (!token) return;

    const fetchSugg = async () => {
      if (query.length < 2) return;
      try {
        const data = await fetchSuggestions(query);
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSugg, 300);
    return () => clearTimeout(timer);
  }, [query, token]);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("weather-user", JSON.stringify(userData));
    localStorage.setItem("weather-token", userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("weather-user");
    localStorage.removeItem("weather-token");
    setAnchorEl(null);
  };

  const handleSearch = (e, value) => {
    if (value) setCity(value);
  };

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 4 }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ px: { xs: 0 }, gap: 2 }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "primary.main", fontWeight: 700, display: { xs: "none", sm: "block" } }}>
                WeatherDash
              </Typography>
              
              <Autocomplete
                freeSolo
                options={suggestions}
                onInputChange={(e, val) => setQuery(val)}
                onChange={handleSearch}
                sx={{ width: { xs: "100%", sm: 300 } }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search city..."
                    size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, bgcolor: "background.default" } }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <SearchIcon size={18} style={{ marginRight: 8, opacity: 0.6 }} />
                          {params.InputProps?.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                {mode === "dark" ? <Sun size={20} /> : <Cloud size={20} />}
              </IconButton>

              <Tooltip title="Account">
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.875rem" }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user?.email}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogOut size={18} style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {error && (
            <Paper sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.error.main, 0.1), border: 1, borderColor: "error.main" }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          <Grid container spacing={3}>
            {/* Current Weather Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <AnimatePresence mode="wait">
                {!loading && weather && (
                  <motion.div
                    key={weather.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card sx={{ 
                      bgcolor: "primary.main", 
                      color: "primary.contrastText",
                      p: 2,
                      background: mode === "dark" 
                        ? "linear-gradient(135deg, #6750A4 0%, #21005D 100%)"
                        : "linear-gradient(135deg, #D0BCFF 0%, #6750A4 100%)"
                    }}>
                      <CardContent>
                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Typography variant="h3" fontWeight={700}>
                              {Math.round(weather.current.temperature)}°
                            </Typography>
                            <Typography variant="h5">
                              {weather.city}, {weather.country}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Cloud size={64} strokeWidth={1} />
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              {weather.current.condition}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Stack direction="row" spacing={3} sx={{ mt: 4, opacity: 0.9 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Wind size={18} />
                            <Typography variant="body2">{weather.current.windSpeed} {units === "metric" ? "m/s" : "mph"}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Droplets size={18} />
                            <Typography variant="body2">{weather.current.humidity}%</Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {weather.highlights.map((item) => (
                        <Grid size={{ xs: 6 }} key={item.label}>
                          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 4 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                              {item.label}
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                              {item.value}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                )}
              </AnimatePresence>
            </Grid>

            {/* Charts and Details */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={3}>
                {!loading && forecast && (
                  <WeatherChart 
                    data={forecast.hourly.map(h => ({ time: h.time, temp: h.temp }))} 
                    title="Hourly Forecast" 
                  />
                )}
                
                {!loading && history && (
                  <WeatherChart 
                    data={history.entries.map(e => ({ time: e.day, temp: e.high }))} 
                    title="Previous Week History" 
                  />
                )}
              </Stack>
            </Grid>

            {/* Daily Forecast */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>7-Day Forecast</Typography>
              <Grid container spacing={2}>
                {!loading && forecast?.daily.map((day, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                    <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>{day.day}</Typography>
                        <Typography variant="body2" color="text.secondary">{day.condition}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h6" color="primary">{Math.round(day.high)}°</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.6 }}>{Math.round(day.low)}°</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
