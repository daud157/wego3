import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

// Define the User interface
interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isDriver: boolean;
  currentProfileStatus: string;
}

interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const userContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
  loading: true,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  setLoading: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  console.log("🚀 ~ UserProvider ~ user:", user);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getToken = async (): Promise<string | null> => {
    const token = await SecureStore.getItemAsync("token");
    return token || null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        try {
          const res = await axios.post("http://192.168.100.23:3000/auth", {
            token,
          });
          setUser(res.data.data);
          setIsLoggedIn(true);
        } catch (err) {
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        loading,
        isLoggedIn,
        setIsLoggedIn,
        setLoading,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  return useContext(userContext);
};
