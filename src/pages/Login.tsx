import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CircularProgress, Container } from "@mui/material";
import { LOGIN_API } from "@/routes/api/loginRoutes";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";
import { CustomSnackbar } from "@/components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface UserInfos {
  username: string,
  user_id: number,
  role: string[]
}

const Login: React.FC = () => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const navigate = useNavigate();

  const auth = useAuth();
  const { setUserName, setUserRole, setUserId, authToken, setAuthToken, setIsAuthenticated } = auth;

  const snackbarRef = useRef<CustomSnackbarMethods>(null);

  const errorMessage = "Ce champ est requis";

  useEffect(() => {
    if(authToken){
       getUserInfos(authToken);
    }
  }, []);

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
        setAuthToken(data.token);

        await getUserInfos(data.token);
      } else {
        setLoading(false);
        snackbarRef.current?.showSnackbar(`Pas de jeton récupéré`, "error");
      }
    } catch (error: unknown) {
      setLoading(false);
      snackbarRef.current?.showSnackbar(`${String(error)}`, "error");
    }
  };

  const getUserInfos = async (userToken: string) => {
    try {
      const response = await fetch(LOGIN_API.login, {
        method: "POST",
        headers: {
          Authorization: "Bearer" + " " + userToken
        },
      });

      if (!response.ok) {
        throw new Error("Entrées invalides");
      }
      const data: UserInfos = await response.json();
      setLoading(false);

      if (data) {
       setUserInfos(data);
      } else {
        snackbarRef.current?.showSnackbar(`Pas de jeton récupéré`, "error");
      }
    } catch (error: unknown) {
      setLoading(false);
      snackbarRef.current?.showSnackbar(`${String(error)}`, "error");
    }
  };

  const setUserInfos = (userInfos: UserInfos) => {
    setUserName(userInfos.username)
    setUserRole(userInfos.role[0])
    setUserId(userInfos.user_id)
    setIsAuthenticated(true)

    navigate("/gamemaster")
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
