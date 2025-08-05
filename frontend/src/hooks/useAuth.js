import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/user/profile") // make sure this returns user data
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  return { authenticated, loading };
};

export default useAuth;
