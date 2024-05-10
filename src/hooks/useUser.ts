import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useLocalStorage } from "./useLocalStorage";
import { User } from "@/types/userInterface";

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage("user");

  const addUser = (user: User) => {
    setUser(user);
    setItem(user);
  };

  const removeUser = () => {
    setUser(null);
    setItem("");
  };
  return { user, addUser, removeUser, setUser };
};
