import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

export interface AuthContextInterface {
  user: any;
  setUser: (value: any) => void;
  login: (email: string, password: string) => void;
}

export const authContextDefaults: AuthContextInterface = {
  user: null,
  setUser: () => {},
  login: () => {},
};

export const AuthContext =
  createContext<AuthContextInterface>(authContextDefaults);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {};

  useEffect(() => {
    if (user) {
      try {
        window.localStorage.setItem("@user", JSON.stringify(user));
      } catch (error) {
        window.localStorage.setItem("@user", JSON.stringify(user));
      }
    }
  }, [user]);

  useEffect(() => {
    // try {
    //   if (location.search.includes("verified")) {
    //     logout();
    //     setCheckingSession(false);
    //   } else if (
    //     location.search.includes("recovery_token") &&
    //     location.search.includes("recoveryStep")
    //   ) {
    //     setCheckingSession(false);
    //     navigate("/" + location.search, { replace: true });
    //   } else {
    //     handleAuthentication();
    //   }
    // } catch (error) {
    //   setIsAuthenticated(false);
    //   setCheckingSession(false);
    //   navigate("/", { replace: true });
    // }
  }, []);

  return (
    <AuthContext.Provider
      value={
        {
          login,
          user,
          setUser,
        } as AuthContextInterface
      }
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
