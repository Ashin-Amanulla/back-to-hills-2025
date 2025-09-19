import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/Auth";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    const isAuth = initializeAuth();
    if (!isAuth) {
      navigate("/login", { replace: true });
    }
  }, [navigate, initializeAuth]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
