import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await api.get("/auth/profile");
          if (data.success) {
            setUser(data);
          } else {
            // Token invalid
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Failed to load user profile", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post("/auth/login", { email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          storeName: data.storeName,
        });
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, storeName) => {
    setLoading(true);
    try {
      const data = await api.post("/auth/register", {
        name,
        email,
        password,
        storeName,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          storeName: data.storeName,
        });
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (name, email, storeName, password) => {
    try {
      const updateData = { name, email, storeName };
      if (password) {
        updateData.password = password;
      }
      const data = await api.put("/auth/profile", updateData);
      if (data.success) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          storeName: data.storeName,
        });
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const forceSeedData = async () => {
    try {
      const data = await api.post("/auth/seed", {});
      return { success: data.success, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        forceSeedData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
