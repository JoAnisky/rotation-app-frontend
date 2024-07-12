import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_API } from "@/routes/api/loginRoutes";
import { CustomSnackbarMethods } from "@/types/SnackbarTypes";

const useCheckAuthentication = (snackbarRef: React.RefObject<CustomSnackbarMethods>) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const csrfToken = localStorage.getItem('csrfToken');
        if (!csrfToken) {
          throw new Error('No CSRF token found');
        }

        const response = await fetch(LOGIN_API.login, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "c-csrf-token": csrfToken
          },
        });

        if (!response.ok) {
          throw new Error("Authentication check failed");
        }

        const data = await response.json();
        if (!data || !data.username) {
          throw new Error("No user data found");
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        navigate("/login");
        snackbarRef.current?.showSnackbar("Authentication check failed", "error");
      }
    };

    checkAuthentication();
  }, [navigate, snackbarRef]);
};

export default useCheckAuthentication;