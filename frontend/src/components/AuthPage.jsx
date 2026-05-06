import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Link,
  alpha,
  Alert,
} from "@mui/material";
import { Cloud } from "lucide-react";
import { login, signup } from "../api/authApi";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await login(formData.email, formData.password);
      } else {
        data = await signup(formData.name, formData.email, formData.password);
      }
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      bgcolor: "background.default",
      background: (theme) => theme.palette.mode === "dark" 
        ? "radial-gradient(circle at 20% 30%, #2B2930 0%, #1C1B1F 100%)"
        : "radial-gradient(circle at 20% 30%, #F3EDF7 0%, #FFFBFE 100%)"
    }}>
      <Container maxWidth="xs">
        <Card sx={{ boxShadow: (theme) => theme.shadows[4] }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3} sx={{ alignItems: "center" }}>
              <Box sx={{ bgcolor: "primary.main", p: 2, borderRadius: 3, color: "primary.contrastText" }}>
                <Cloud size={32} />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {isLogin ? "Welcome Back" : "Join WeatherDash"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isLogin ? "Enter your details to access your dashboard" : "Create an account to save your favorite cities"}
                </Typography>
              </Box>

              {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <Stack spacing={2}>
                  {!isLogin && (
                    <TextField
                      label="Full Name"
                      name="name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  )}
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{ py: 1.5, mt: 1 }}
                  >
                    {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setIsLogin(!isLogin)}
                  sx={{ fontWeight: 600 }}
                >
                  {isLogin ? "Sign up" : "Log in"}
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
