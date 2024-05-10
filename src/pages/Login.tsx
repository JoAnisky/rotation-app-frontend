import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ login: username, password })
      });

      if (!response.ok) {
        throw new Error("Login failed!");
      }

      const data = await response.json();
      console.log("data reçue : ", data);
      //onLoginSuccess(data.token); // Vous pouvez stocker le token ici ou mettre à jour l'état global
    } catch (error) {
      console.error(error);
      //   setError(error.message || 'An error occurred');
    }
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", height: "100vh", padding: "0" }}>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "85%",
          p: 2,
          height: "75vh",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={e => setUsername(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Container>
    </Container>
  );
};

export default Login;
