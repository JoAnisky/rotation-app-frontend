import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CircularProgress, Container } from "@mui/material";
import { LOGIN_API } from "@/routes/api/loginRoutes";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";
import { CustomSnackbar } from "@/components";

const Login: React.FC = () => {
  const snackbarRef = useRef<CustomSnackbarMethods>(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  // const userInfos = useState({
  //   username
  // })
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const errorMessage = "Ce champ est requis";

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username) {
      setUsernameError(true);
      snackbarRef.current?.showSnackbar("Il faudrait entrer un nom", "warning");
      return;
    } else {
      setUsernameError(false);
    }

    if (!password) {
      setPasswordError(true);
      snackbarRef.current?.showSnackbar("Il faudrait entrer un mot de passe", "warning");
      return;
    } else {
      setPasswordError(false);
    }

    getAccessToken();
  };

  const getAccessToken = async () => {
    setLoading(true);
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
      if (data.token) {
        setToken(data.token);
        getUserId(data.token);
      } else {
        setLoading(false)
        snackbarRef.current?.showSnackbar(`Pas de jeton récupéré`, "error");
      }
    } catch (error: unknown) {
      setLoading(false);
      snackbarRef.current?.showSnackbar(`${String(error)}`, "error");
    }
  };

  const getUserId = async (userToken: string) => {
    console.log(userToken);
    try {
      const response = await fetch(LOGIN_API.login, {
        method: "POST",
        headers: {
          "Authorization": "Bearer" + " " + userToken
        },
      });

      if (!response.ok) {
        throw new Error("Entrées invalides");
      }
      const data = await response.json();
      setLoading(false);
      console.log(data);
      // if (data.token) {
      //   setUserId(data.user_id)
      //   getUserId(token);
      // } else {
      //   snackbarRef.current?.showSnackbar(`Pas de jeton récupéré`, "error");
      //}
    } catch (error: unknown) {
      setLoading(false);
      snackbarRef.current?.showSnackbar(`${String(error)}`, "error");
    }
  }

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
            error={usernameError}
            helperText={usernameError && errorMessage}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
            fullWidth
            error={passwordError}
            helperText={passwordError && errorMessage}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {loading ? <CircularProgress style={{ color: "#fff" }} /> : "Connexion"}
          </Button>
        </form>
      </Container>
      <CustomSnackbar ref={snackbarRef} />
    </Container>
  );
};

export default Login;
