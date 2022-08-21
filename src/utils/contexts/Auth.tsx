import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

export interface AuthContextInterface {
  user: { name: string } | null;
  token: string | null;
  setUser: (value: any) => void;
  setToken: (value: any) => void;
  login(body: any): Promise<any>;
  logout: () => void;
}

export const authContextDefaults: AuthContextInterface = {
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  login: async () => {},
  logout: () => {},
};

export const AuthContext =
  createContext<AuthContextInterface>(authContextDefaults);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<{ name: string; number: string } | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);

  const logout = () => {
    setUser(null);
    setToken(null);

    window.localStorage.removeItem("@user");
    window.localStorage.removeItem("@token");
  };

  const login = async (body: any) =>
    await new Promise<void>(async (resolve, reject) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body,
        }),
      });

      const data = await res.json();
      if (data.success) {
        resolve();
      }
      reject(data.message || "Erro ao fazer login");
    });

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
    if (token) {
      try {
        window.localStorage.setItem("@token", token);
      } catch (error) {
        window.localStorage.setItem("@token", token);
      }
    }
  }, [token]);

  const handleAuthentication = async () => {
    const token = window.localStorage.getItem("@token");
    const user = window.localStorage.getItem("@user");

    if (token && user) {
      setUser(JSON.parse(user));
      setToken(token);
    }
  };

  useEffect(() => {
    handleAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={
        {
          login,
          logout,
          user,
          token,
          setUser,
          setToken,
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
