import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

const AppRoutes = () => {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Redirect if already logged in */}
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/signup"
        element={token ? <Navigate to="/" /> : <Signup />}
      />

      {/* Protected route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
};

export default App;
