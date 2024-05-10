import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { LOGIN_API } from "@/routes/api/loginRoutes";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";
import { CustomSnackbar } from "@/components";

const Login: React.FC = () => {
  const snackbarRef = useRef<CustomSnackbarMethods>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string>("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username) {
      snackbarRef.current?.showSnackbar("Il faudrait entrer un nom", "warning");
      return;
    }

    if (!password) {
      snackbarRef.current?.showSnackbar("Il faudrait entrer un mot de passe", "warning");
      return;
    }

    try {
      const response = await fetch(LOGIN_API.loginCheck, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Entrées invalides");
      }

      const data = await response.json();
      setToken(data.token);
    } catch (error: unknown) {
      console.error(error);
      snackbarRef.current?.showSnackbar(`${String(error)}`, "error");
    }
  };

  useEffect(() => {
    console.log("token : ", token);
  }, [token])
  
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

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Connexion
          </Button>
        </form>
      </Container>
      <CustomSnackbar ref={snackbarRef} />
    </Container>
  );
};

export default Login;
