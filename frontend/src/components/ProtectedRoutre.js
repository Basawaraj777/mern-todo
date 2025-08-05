// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
