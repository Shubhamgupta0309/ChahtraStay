import Loading from "../pages/Loading"
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);


  if (loading) return <Loading />; 

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
